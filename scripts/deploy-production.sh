#!/usr/bin/env bash
# =============================================================================
# Plateforme-AFD — déploiement production (releases atomiques + PM2)
#
# Usage (sur le VPS, utilisateur afdrd7787 recommandé) :
#   export VPS_APP_PATH=/home/afd-rdc.org/apps/plateforme-afd
#   bash scripts/deploy-production.sh <git-sha> [branch] [repo-ssh-url]
#
# Exemple :
#   bash scripts/deploy-production.sh abcdef123 main git@github-afd:ibrahimkasende-crypto/Platefrome-AFD.git
#
# Prérequis :
#   - shared/.env.production (chmod 600) via setup-production-env.sh
#   - Deploy Key GitHub + alias SSH github-afd
#   - Node 20–24, npm, pm2, curl, git, rsync
# =============================================================================
set -Eeuo pipefail

log() { printf '[deploy %s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"; }
fail() { printf '[deploy][ERREUR] %s\n' "$*" >&2; exit 1; }

REF="${1:-}"
[[ -n "${REF}" ]] || fail "Usage: $0 <git-sha-or-ref> [branch] [repo-ssh-url]"

DEPLOY_BRANCH="${2:-${VPS_DEPLOY_BRANCH:-main}}"
REPO_SSH_URL="${3:-${VPS_REPO_SSH_URL:-git@github-afd:ibrahimkasende-crypto/Platefrome-AFD.git}}"

APP_ROOT="${VPS_APP_PATH:-/home/afd-rdc.org/apps/plateforme-afd}"
APP_ROOT="$(cd "${APP_ROOT}" && pwd)"

KEEP_RELEASES="${KEEP_RELEASES:-5}"
PORT="${PORT:-3000}"
HEALTH_LOCAL="${HEALTH_LOCAL:-http://127.0.0.1:${PORT}/api/health}"
HEALTH_PUBLIC="${HEALTH_PUBLIC:-https://afd-rdc.org/api/health}"
SKIP_PUBLIC_CHECK="${SKIP_PUBLIC_CHECK:-0}"
RUN_TYPECHECK="${RUN_TYPECHECK:-1}"
RUN_LINT="${RUN_LINT:-1}"
RUN_TEST="${RUN_TEST:-1}"
GIT_DIR="${GIT_DIR:-${APP_ROOT}/repo}"
RELEASES_DIR="${APP_ROOT}/releases"
SHARED_DIR="${APP_ROOT}/shared"
LOGS_DIR="${APP_ROOT}/logs"
CURRENT_LINK="${APP_ROOT}/current"
ECOSYSTEM="${APP_ROOT}/ecosystem.config.cjs"
DEPLOY_LOG="${LOGS_DIR}/deploy.log"

mkdir -p "${RELEASES_DIR}" "${SHARED_DIR}" "${LOGS_DIR}"
touch "${DEPLOY_LOG}"
exec > >(tee -a "${DEPLOY_LOG}") 2>&1

log "APP_ROOT=${APP_ROOT}"
log "REF=${REF}"
log "BRANCH=${DEPLOY_BRANCH}"
log "REPO=${REPO_SSH_URL}"

[[ -f "${SHARED_DIR}/.env.production" ]] || fail "shared/.env.production manquant — lancez setup-production-env.sh"

command -v node >/dev/null || fail "node introuvable"
command -v npm >/dev/null || fail "npm introuvable"
command -v pm2 >/dev/null || fail "pm2 introuvable"
command -v git >/dev/null || fail "git introuvable"
command -v curl >/dev/null || fail "curl introuvable"
command -v rsync >/dev/null || fail "rsync introuvable"

log "node=$(node -v) npm=$(npm -v) git=$(git --version)"

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [[ "${NODE_MAJOR}" -lt 20 || "${NODE_MAJOR}" -gt 24 ]]; then
  fail "Node $(node -v) hors plage >=20 <=24"
fi

# Clone initial si nécessaire (Deploy Key + alias github-afd)
if [[ ! -d "${GIT_DIR}/.git" ]]; then
  log "Clone initial → ${GIT_DIR}"
  mkdir -p "$(dirname "${GIT_DIR}")"
  git clone "${REPO_SSH_URL}" "${GIT_DIR}"
fi

PREVIOUS_TARGET=""
if [[ -L "${CURRENT_LINK}" ]]; then
  PREVIOUS_TARGET="$(readlink -f "${CURRENT_LINK}" || true)"
  log "previous_current=${PREVIOUS_TARGET}"
fi

log "Fetch / checkout ${REF}"
git -C "${GIT_DIR}" remote set-url origin "${REPO_SSH_URL}" 2>/dev/null || true
git -C "${GIT_DIR}" fetch --prune origin
git -C "${GIT_DIR}" checkout --force "${REF}"
git -C "${GIT_DIR}" reset --hard "${REF}"

SHORT_SHA="$(git -C "${GIT_DIR}" rev-parse --short=12 HEAD)"
FULL_SHA="$(git -C "${GIT_DIR}" rev-parse HEAD)"
STAMP="$(date +%Y%m%d-%H%M%S)-${SHORT_SHA}"
RELEASE_DIR="${RELEASES_DIR}/${STAMP}"
log "RELEASE=${RELEASE_DIR}"

mkdir -p "${RELEASE_DIR}"
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

# Env partagé (lien symbolique — jamais de copie permanente des secrets)
ln -sfn "${SHARED_DIR}/.env.production" "${RELEASE_DIR}/.env.production"

log "npm ci"
npm ci

if [[ "${RUN_TYPECHECK}" == "1" ]]; then
  log "npm run typecheck"
  npm run typecheck || fail "typecheck échoué — current inchangé"
fi
if [[ "${RUN_LINT}" == "1" ]]; then
  log "npm run lint"
  npm run lint || fail "lint échoué — current inchangé"
fi
if [[ "${RUN_TEST}" == "1" ]]; then
  log "npm run test"
  npm run test || fail "tests échoués — current inchangé"
fi

log "npm run build:standalone"
npm run build:standalone || fail "build:standalone échoué — current inchangé"

ln -sfn "${SHARED_DIR}/.env.production" \
  "${RELEASE_DIR}/.next/standalone/.env.production"

[[ -f "${RELEASE_DIR}/.next/standalone/server.js" ]] || fail "server.js manquant"
[[ -d "${RELEASE_DIR}/.next/standalone/.next/static" ]] || fail "static manquant"
[[ -d "${RELEASE_DIR}/.next/standalone/public" ]] || fail "public manquant"

cat > "${RELEASE_DIR}/RELEASE_VERSION" <<EOF
SHA=${FULL_SHA}
SHORT_SHA=${SHORT_SHA}
BRANCH=${DEPLOY_BRANCH}
DATE_UTC=$(date -u +%Y-%m-%dT%H:%M:%SZ)
STAMP=${STAMP}
EOF

# Smoke test hors ligne (ancienne version toujours active)
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

log "Switch current → ${RELEASE_DIR}"
ln -sfn "${RELEASE_DIR}" "${CURRENT_LINK}.tmp"
mv -Tf "${CURRENT_LINK}.tmp" "${CURRENT_LINK}"

cp -f "${RELEASE_DIR}/ecosystem.config.cjs" "${ECOSYSTEM}"
export VPS_APP_PATH="${APP_ROOT}"
export PORT
mkdir -p "${LOGS_DIR}"
cd "${APP_ROOT}"
log "pm2 startOrReload"
pm2 startOrReload "${ECOSYSTEM}" --env production --update-env
pm2 save

sleep 2
log "Health local ${HEALTH_LOCAL}"
if ! curl -fsS --max-time 20 "${HEALTH_LOCAL}" | grep -q '"status":"ok"'; then
  log "Health local KO — rollback"
  if [[ -n "${PREVIOUS_TARGET}" && -d "${PREVIOUS_TARGET}" ]]; then
    ln -sfn "${PREVIOUS_TARGET}" "${CURRENT_LINK}.tmp"
    mv -Tf "${CURRENT_LINK}.tmp" "${CURRENT_LINK}"
    pm2 startOrReload "${ECOSYSTEM}" --env production --update-env
    pm2 save
  fi
  mv "${RELEASE_DIR}" "${RELEASE_DIR}.failed-$(date +%s)" 2>/dev/null || true
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
    mv "${RELEASE_DIR}" "${RELEASE_DIR}.failed-$(date +%s)" 2>/dev/null || true
    fail "Déploiement annulé (health public)"
  fi
fi

mapfile -t ALL_RELEASES < <(ls -1dt "${RELEASES_DIR}"/* 2>/dev/null | grep -v '\.failed-' || true)
if ((${#ALL_RELEASES[@]} > KEEP_RELEASES)); then
  for old in "${ALL_RELEASES[@]:KEEP_RELEASES}"; do
    cur="$(readlink -f "${CURRENT_LINK}" || true)"
    [[ "${old}" == "${cur}" || "${old}" == "${PREVIOUS_TARGET}" ]] && continue
    log "Purge ancienne release $(basename "${old}")"
    rm -rf "${old}"
  done
fi

log "OK deploy ${STAMP} sha=${FULL_SHA}"
pm2 status plateforme-afd || true
