#!/usr/bin/env bash
# =============================================================================
# Plateforme-AFD — déploiement production (releases atomiques + PM2)
#
# Usage (sur le VPS, utilisateur afdrd7787) :
#   bash scripts/deploy-production.sh
#   bash scripts/deploy-production.sh <git-sha> [branch] [repo-ssh-url]
#
# Prérequis :
#   - shared/.env.production (chmod 600, owner afdrd7787)
#   - Deploy Key + alias SSH github-afd
#   - Node 20–24, npm, pm2, curl, git, rsync
# =============================================================================
set -Eeuo pipefail

log() { printf '[deploy %s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"; }
fail() { printf '[deploy][ERREUR] %s\n' "$*" >&2; exit 1; }

APP_ROOT="${VPS_APP_PATH:-/home/afd-rdc.org/apps/plateforme-afd}"
APP_USER="${VPS_APP_USER:-afdrd7787}"
DEPLOY_BRANCH="${2:-${VPS_DEPLOY_BRANCH:-main}}"
REPO_SSH_URL="${3:-${VPS_REPO_SSH_URL:-git@github-afd:ibrahimkasende-crypto/Plateforme-AFD.git}}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"
PORT="${PORT:-3000}"
HEALTH_LOCAL="${HEALTH_LOCAL:-http://127.0.0.1:${PORT}/api/health}"
HEALTH_PUBLIC="${HEALTH_PUBLIC:-https://afd-rdc.org/api/health}"
SKIP_PUBLIC_CHECK="${SKIP_PUBLIC_CHECK:-0}"
RUN_TYPECHECK="${RUN_TYPECHECK:-1}"
RUN_LINT="${RUN_LINT:-1}"
RUN_TEST="${RUN_TEST:-1}"

EXPECTED_USER="${APP_USER}"
CURRENT_USER="$(id -un)"
if [[ "${CURRENT_USER}" != "${EXPECTED_USER}" && "$(id -u)" -ne 0 ]]; then
  fail "Utilisateur attendu: ${EXPECTED_USER} (actuel: ${CURRENT_USER})"
fi

APP_ROOT="$(cd "${APP_ROOT}" && pwd)"
GIT_DIR="${GIT_DIR:-${APP_ROOT}/repo}"
RELEASES_DIR="${APP_ROOT}/releases"
SHARED_DIR="${APP_ROOT}/shared"
LOGS_DIR="${APP_ROOT}/logs"
CURRENT_LINK="${APP_ROOT}/current"
ECOSYSTEM="${APP_ROOT}/ecosystem.config.cjs"
ENV_FILE="${SHARED_DIR}/.env.production"
DEPLOY_LOG="${LOGS_DIR}/deploy.log"

mkdir -p "${RELEASES_DIR}" "${SHARED_DIR}" "${LOGS_DIR}"
touch "${DEPLOY_LOG}"
exec > >(tee -a "${DEPLOY_LOG}") 2>&1

log "APP_ROOT=${APP_ROOT}"
log "USER=${CURRENT_USER}"
log "BRANCH=${DEPLOY_BRANCH}"
log "REPO=${REPO_SSH_URL}"

command -v node >/dev/null || fail "node introuvable"
command -v npm >/dev/null || fail "npm introuvable"
command -v pm2 >/dev/null || fail "pm2 introuvable"
command -v git >/dev/null || fail "git introuvable"
command -v curl >/dev/null || fail "curl introuvable"
command -v rsync >/dev/null || fail "rsync introuvable"

log "node=$(node -v) npm=$(npm -v) git=$(git --version) pm2=$(pm2 -v 2>/dev/null || echo '?')"

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [[ "${NODE_MAJOR}" -lt 20 || "${NODE_MAJOR}" -gt 24 ]]; then
  fail "Node $(node -v) hors plage >=20 <=24"
fi

[[ -f "${ENV_FILE}" ]] || fail "shared/.env.production manquant"
ENV_OWNER="$(stat -c '%U' "${ENV_FILE}" 2>/dev/null || true)"
ENV_PERM="$(stat -c '%a' "${ENV_FILE}" 2>/dev/null || true)"
[[ "${ENV_OWNER}" == "${APP_USER}" ]] || fail ".env.production owner=${ENV_OWNER:-?} attendu ${APP_USER}"
[[ "${ENV_PERM}" == "600" ]] || fail ".env.production perms=${ENV_PERM:-?} attendu 600"
# Vérifier présence des noms de variables uniquement (jamais les valeurs)
for key in NEXT_PUBLIC_SITE_URL NEXT_PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY; do
  grep -qE "^${key}=" "${ENV_FILE}" || fail "Variable manquante (nom): ${key}"
done
if ! grep -qE '^NEXT_PUBLIC_SUPABASE_(PUBLISHABLE|ANON)_KEY=' "${ENV_FILE}"; then
  fail "Variable manquante (nom): NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ou ANON_KEY"
fi
log "env_file OK owner=${ENV_OWNER} perms=${ENV_PERM} (valeurs non affichées)"

# Clone initial si nécessaire
if [[ ! -d "${GIT_DIR}/.git" ]]; then
  log "Clone initial → ${GIT_DIR}"
  mkdir -p "$(dirname "${GIT_DIR}")"
  git clone "${REPO_SSH_URL}" "${GIT_DIR}"
fi

git -C "${GIT_DIR}" remote set-url origin "${REPO_SSH_URL}" 2>/dev/null || true
git -C "${GIT_DIR}" fetch --prune origin

REF="${1:-}"
if [[ -z "${REF}" ]]; then
  REF="$(git -C "${GIT_DIR}" rev-parse "origin/${DEPLOY_BRANCH}")"
fi
log "REF=${REF}"

git -C "${GIT_DIR}" checkout --force "${REF}"
git -C "${GIT_DIR}" reset --hard "${REF}"

SHORT_SHA="$(git -C "${GIT_DIR}" rev-parse --short=12 HEAD)"
FULL_SHA="$(git -C "${GIT_DIR}" rev-parse HEAD)"
STAMP="$(date +%Y%m%d-%H%M%S)-${SHORT_SHA}"
RELEASE_DIR="${RELEASES_DIR}/${STAMP}"
log "RELEASE=${RELEASE_DIR}"

PREVIOUS_TARGET=""
if [[ -L "${CURRENT_LINK}" ]]; then
  PREVIOUS_TARGET="$(readlink -f "${CURRENT_LINK}" || true)"
  log "previous_current=${PREVIOUS_TARGET}"
elif [[ -e "${CURRENT_LINK}" && ! -L "${CURRENT_LINK}" ]]; then
  fail "current existe mais n'est pas un symlink — intervention manuelle requise"
fi

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
ln -sfn "${ENV_FILE}" "${RELEASE_DIR}/.env.production"

log "npm ci"
npm ci

if [[ "${RUN_TYPECHECK}" == "1" ]] && npm run | grep -qE '^  typecheck'; then
  log "npm run typecheck"
  npm run typecheck || fail "typecheck échoué — current inchangé"
fi
if [[ "${RUN_LINT}" == "1" ]] && npm run | grep -qE '^  lint'; then
  log "npm run lint"
  npm run lint || fail "lint échoué — current inchangé"
fi
if [[ "${RUN_TEST}" == "1" ]] && npm run | grep -qE '^  test'; then
  log "npm run test"
  npm run test || fail "tests échoués — current inchangé"
fi

if npm run | grep -qE '^  build:production'; then
  log "npm run build:production"
  npm run build:production || fail "build:production échoué — current inchangé"
elif npm run | grep -qE '^  build:standalone'; then
  log "npm run build:standalone"
  npm run build:standalone || fail "build:standalone échoué — current inchangé"
else
  fail "Aucun script build:production / build:standalone"
fi

ln -sfn "${ENV_FILE}" "${RELEASE_DIR}/.next/standalone/.env.production"

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

# Env chargé via symlink RELEASE/.env.production et PM2 env_file (jamais journalisé)
export NODE_ENV=production HOSTNAME=127.0.0.1 PORT

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
for _ in $(seq 1 45); do
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
mkdir -p "${LOGS_DIR}"
cd "${APP_ROOT}"
log "pm2 startOrReload"
pm2 startOrReload "${ECOSYSTEM}" --env production --update-env
pm2 save

sleep 3
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
    log "Health public KO — rollback (proxy OLS peut être absent au 1er deploy)"
    if [[ -n "${PREVIOUS_TARGET}" && -d "${PREVIOUS_TARGET}" ]]; then
      ln -sfn "${PREVIOUS_TARGET}" "${CURRENT_LINK}.tmp"
      mv -Tf "${CURRENT_LINK}.tmp" "${CURRENT_LINK}"
      pm2 startOrReload "${ECOSYSTEM}" --env production --update-env
      pm2 save
    fi
    mv "${RELEASE_DIR}" "${RELEASE_DIR}.failed-$(date +%s)" 2>/dev/null || true
    fail "Déploiement annulé (health public) — utilisez SKIP_PUBLIC_CHECK=1 si proxy pas prêt"
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
curl -fsS --max-time 10 "${HEALTH_LOCAL}" || true
