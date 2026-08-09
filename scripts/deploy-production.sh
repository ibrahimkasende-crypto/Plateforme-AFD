#!/usr/bin/env bash
# =============================================================================
# Plateforme-AFD — déploiement production (releases atomiques + PM2)
#
# Usage (sur le VPS) :
#   bash scripts/deploy-production.sh <git-sha-or-ref>
#   VPS_APP_PATH=/home/afd-rdc.org/apps/plateforme-afd \
#     bash scripts/deploy-production.sh abc1234
#
# Prérequis :
#   - dépôt cloné une fois dans $VPS_APP_PATH/repo (ou GIT_DIR)
#   - shared/.env.production (chmod 600)
#   - Node 20–24, npm, pm2, curl, git
# =============================================================================
set -Eeuo pipefail

log() { printf '[deploy %s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"; }
fail() { printf '[deploy][ERREUR] %s\n' "$*" >&2; exit 1; }

REF="${1:-}"
[[ -n "${REF}" ]] || fail "Usage: $0 <git-sha-or-ref>"

APP_ROOT="${VPS_APP_PATH:-}"
[[ -n "${APP_ROOT}" ]] || fail "VPS_APP_PATH non défini"
APP_ROOT="$(cd "${APP_ROOT}" && pwd)"

KEEP_RELEASES="${KEEP_RELEASES:-5}"
PORT="${PORT:-3000}"
HEALTH_LOCAL="${HEALTH_LOCAL:-http://127.0.0.1:${PORT}/api/health}"
HEALTH_PUBLIC="${HEALTH_PUBLIC:-https://afd-rdc.org/api/health}"
SKIP_PUBLIC_CHECK="${SKIP_PUBLIC_CHECK:-0}"
RUN_TYPECHECK="${RUN_TYPECHECK:-1}"
GIT_DIR="${GIT_DIR:-${APP_ROOT}/repo}"
DEPLOY_BRANCH="${VPS_DEPLOY_BRANCH:-main}"
STAMP="$(date +%Y%m%d-%H%M%S)"
RELEASE_DIR="${APP_ROOT}/releases/${STAMP}"
SHARED_DIR="${APP_ROOT}/shared"
CURRENT_LINK="${APP_ROOT}/current"
ECOSYSTEM="${APP_ROOT}/ecosystem.config.cjs"
DEPLOY_LOG="${SHARED_DIR}/logs/deploy.log"

mkdir -p "${APP_ROOT}/releases" "${SHARED_DIR}/logs" "${APP_ROOT}"
touch "${DEPLOY_LOG}"
exec > >(tee -a "${DEPLOY_LOG}") 2>&1

log "APP_ROOT=${APP_ROOT}"
log "REF=${REF}"
log "RELEASE=${RELEASE_DIR}"

[[ -f "${SHARED_DIR}/.env.production" ]] || fail "shared/.env.production manquant"

command -v node >/dev/null || fail "node introuvable"
command -v npm >/dev/null || fail "npm introuvable"
command -v pm2 >/dev/null || fail "pm2 introuvable"
command -v git >/dev/null || fail "git introuvable"
command -v curl >/dev/null || fail "curl introuvable"

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [[ "${NODE_MAJOR}" -lt 20 || "${NODE_MAJOR}" -gt 24 ]]; then
  fail "Node $(node -v) hors plage >=20 <=24"
fi

[[ -d "${GIT_DIR}/.git" ]] || fail "Dépôt git introuvable: ${GIT_DIR}"

# Mémoriser l'ancienne release (pour rollback)
PREVIOUS_TARGET=""
if [[ -L "${CURRENT_LINK}" ]]; then
  PREVIOUS_TARGET="$(readlink -f "${CURRENT_LINK}" || true)"
  log "previous_current=${PREVIOUS_TARGET}"
fi

# 1) Nouvelle release hors ligne
mkdir -p "${RELEASE_DIR}"
log "Fetch / checkout ${REF}"
git -C "${GIT_DIR}" fetch --prune origin
git -C "${GIT_DIR}" checkout --force "${REF}"
git -C "${GIT_DIR}" reset --hard "${REF}"

# Copier le code (sans .git / node_modules / .next) vers la release
log "Sync code → release"
rsync -a --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude 'Deploy' \
  --exclude 'logs' \
  --exclude 'coverage' \
  --exclude 'playwright-report' \
  --exclude 'test-results' \
  --exclude '.env' \
  --exclude '.env.*' \
  "${GIT_DIR}/" "${RELEASE_DIR}/"

cd "${RELEASE_DIR}"

# 2) Lien env partagé (persistants hors release)
ln -sfn "${SHARED_DIR}/.env.production" "${RELEASE_DIR}/.env.production"

# 3) Install + validations + build (l'ancienne version reste en ligne)
log "npm ci"
npm ci

if [[ "${RUN_TYPECHECK}" == "1" ]]; then
  log "npm run typecheck"
  npm run typecheck
fi

log "npm run build"
npm run build || fail "Build échoué — current inchangé"

log "prepare-standalone"
node scripts/prepare-standalone.mjs

# Relier aussi l'env dans le cwd standalone (Next lit .env.production)
ln -sfn "${SHARED_DIR}/.env.production" \
  "${RELEASE_DIR}/.next/standalone/.env.production"

[[ -f "${RELEASE_DIR}/.next/standalone/server.js" ]] || fail "server.js manquant"
[[ -d "${RELEASE_DIR}/.next/standalone/.next/static" ]] || fail "static manquant"
[[ -d "${RELEASE_DIR}/.next/standalone/public" ]] || fail "public manquant"

# 4) Smoke test de la nouvelle release sur un port temporaire
# Next lit .env.production via le symlink (aucun secret journalisé ici).
SMOKE_PORT="${SMOKE_PORT:-3010}"
log "Smoke test standalone :${SMOKE_PORT}"
(
  cd "${RELEASE_DIR}/.next/standalone"
  HOSTNAME=127.0.0.1 PORT="${SMOKE_PORT}" NODE_ENV=production \
    node server.js
) &
SMOKE_PID=$!
cleanup_smoke() { kill "${SMOKE_PID}" >/dev/null 2>&1 || true; wait "${SMOKE_PID}" 2>/dev/null || true; }
trap cleanup_smoke EXIT

ok_smoke=0
for _ in $(seq 1 40); do
  if curl -fsS --max-time 2 "http://127.0.0.1:${SMOKE_PORT}/api/health" >/dev/null 2>&1; then
    ok_smoke=1
    break
  fi
  sleep 1
done
[[ "${ok_smoke}" == "1" ]] || fail "Smoke health KO sur :${SMOKE_PORT} — current inchangé"
cleanup_smoke
trap - EXIT
log "Smoke OK"

# 5) Basculement atomique du symlink current
log "Switch current → ${RELEASE_DIR}"
ln -sfn "${RELEASE_DIR}" "${CURRENT_LINK}.tmp"
mv -Tf "${CURRENT_LINK}.tmp" "${CURRENT_LINK}"

# 6) PM2 reload — ecosystem à la racine APP_ROOT (hors release)
cp -f "${RELEASE_DIR}/ecosystem.config.cjs" "${ECOSYSTEM}"
export VPS_APP_PATH="${APP_ROOT}"
export PORT
cd "${APP_ROOT}"
log "pm2 startOrReload"
pm2 startOrReload "${ECOSYSTEM}" --env production --update-env
pm2 save

# 7) Health checks
sleep 2
log "Health local ${HEALTH_LOCAL}"
if ! curl -fsS --max-time 20 "${HEALTH_LOCAL}" | grep -q '"status":"ok"'; then
  log "Health local KO — rollback vers previous"
  if [[ -n "${PREVIOUS_TARGET}" && -d "${PREVIOUS_TARGET}" ]]; then
    ln -sfn "${PREVIOUS_TARGET}" "${CURRENT_LINK}.tmp"
    mv -Tf "${CURRENT_LINK}.tmp" "${CURRENT_LINK}"
    pm2 startOrReload "${ECOSYSTEM}" --env production --update-env
    pm2 save
  fi
  fail "Déploiement annulé (health local)"
fi

if [[ "${SKIP_PUBLIC_CHECK}" != "1" ]]; then
  log "Health public ${HEALTH_PUBLIC}"
  if ! curl -fsS --max-time 30 "${HEALTH_PUBLIC}" | grep -q '"status":"ok"'; then
    log "Health public KO — rollback"
    if [[ -n "${PREVIOUS_TARGET}" && -d "${PREVIOUS_TARGET}" ]]; then
      ln -sfn "${PREVIOUS_TARGET}" "${CURRENT_LINK}.tmp"
      mv -Tf "${CURRENT_LINK}.tmp" "${CURRENT_LINK}"
      pm2 startOrReload "${ECOSYSTEM}" --env production --update-env
      pm2 save
    fi
    fail "Déploiement annulé (health public)"
  fi
fi

# 8) Rotation releases
mapfile -t ALL_RELEASES < <(ls -1dt "${APP_ROOT}/releases"/* 2>/dev/null || true)
if ((${#ALL_RELEASES[@]} > KEEP_RELEASES)); then
  for old in "${ALL_RELEASES[@]:KEEP_RELEASES}"; do
    # Ne jamais supprimer la release courante ni previous
    cur="$(readlink -f "${CURRENT_LINK}" || true)"
    [[ "${old}" == "${cur}" || "${old}" == "${PREVIOUS_TARGET}" ]] && continue
    log "Purge ancienne release ${old}"
    rm -rf "${old}"
  done
fi

log "OK deploy ${STAMP} ref=${REF}"
pm2 status plateforme-afd || true
