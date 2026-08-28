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

# Health check strict : exige HTTP 200 + "status":"ok" (jamais un 404).
# Retourne 0 si OK. Affiche corps / diagnostic en cas d'échec.
wait_for_health() {
  local url="$1"
  local label="$2"
  local timeout_s="${3:-30}"
  local started
  started="$(date +%s)"
  local attempt=0
  local body="" http_code="" curl_exit=0

  while true; do
    attempt=$((attempt + 1))
    body="$(mktemp)"
    set +e
    http_code="$(curl -sS -o "${body}" -w '%{http_code}' --max-time 5 "${url}" 2>/tmp/afd-health-curl.err)"
    curl_exit=$?
    set -e

    if [[ "${curl_exit}" -eq 0 && "${http_code}" == "200" ]] && grep -q '"status":"ok"' "${body}"; then
      log "${label} OK (attempt=${attempt} http=${http_code})"
      cat "${body}" || true
      rm -f "${body}"
      return 0
    fi

    local reason="unknown"
    if [[ "${curl_exit}" -ne 0 ]]; then
      if grep -qiE 'Connection refused|Failed to connect' /tmp/afd-health-curl.err 2>/dev/null; then
        reason="connection_refused"
      elif grep -qiE 'timed out|Timeout' /tmp/afd-health-curl.err 2>/dev/null; then
        reason="timeout"
      else
        reason="curl_exit_${curl_exit}"
      fi
    elif [[ "${http_code}" == "404" ]]; then
      reason="http_404"
    elif [[ -n "${http_code}" ]]; then
      reason="http_${http_code}"
    fi

    log "${label} tentative ${attempt} KO reason=${reason} http=${http_code:-n/a}"
    if [[ -s "${body}" ]]; then
      log "${label} body=$(head -c 400 "${body}" | tr '\n' ' ')"
    fi
    if [[ -s /tmp/afd-health-curl.err ]]; then
      log "${label} curl_err=$(head -c 200 /tmp/afd-health-curl.err | tr '\n' ' ')"
    fi
    rm -f "${body}"

    local now
    now="$(date +%s)"
    if (( now - started >= timeout_s )); then
      log "${label} ÉCHEC après ${timeout_s}s (${attempt} tentatives)"
      return 1
    fi
    sleep 1
  done
}

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
# Si un SHA complet est fourni (ex. GitHub Actions github.sha), exiger une correspondance exacte
if [[ "${REF}" =~ ^[0-9a-fA-F]{40}$ && "${FULL_SHA}" != "${REF}" ]]; then
  fail "SHA déployé (${FULL_SHA}) ≠ SHA demandé (${REF})"
fi
STAMP="$(date +%Y%m%d-%H%M%S)-${SHORT_SHA}"
RELEASE_DIR="${RELEASES_DIR}/${STAMP}"
log "RELEASE=${RELEASE_DIR} sha=${FULL_SHA}"

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
    GIT_SHA="${FULL_SHA}" \
    node server.js
) &
SMOKE_PID=$!
cleanup_smoke() { kill "${SMOKE_PID}" >/dev/null 2>&1 || true; wait "${SMOKE_PID}" 2>/dev/null || true; }
trap cleanup_smoke EXIT

# Smoke = test de LA nouvelle release (port temporaire) AVANT bascule current
wait_for_health "http://127.0.0.1:${SMOKE_PORT}/api/health" "SmokeRelease" 45 \
  || fail "Smoke health KO sur release :${SMOKE_PORT} — current inchangé"
# Confirmer la différence 404 vs health
smoke_404_code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 5 \
  "http://127.0.0.1:${SMOKE_PORT}/api/route-inexistante" || true)"
log "Smoke route inexistante http=${smoke_404_code} (attendu 404)"
cleanup_smoke
trap - EXIT
log "SmokeRelease OK"

HEALTH_BUILD_DIR="${RELEASE_DIR}/.next/standalone/.next/server/app/api/health"
[[ -d "${HEALTH_BUILD_DIR}" ]] || fail "Route health absente du standalone: ${HEALTH_BUILD_DIR}"
if ! grep -R "api/health" "${RELEASE_DIR}/.next/server/"*manifest*.json >/dev/null 2>&1 \
  && ! grep -R "api/health" "${RELEASE_DIR}/.next/standalone/.next/server/"*manifest*.json >/dev/null 2>&1; then
  # Cherche aussi récursivement
  if ! grep -R "api/health" "${RELEASE_DIR}/.next/server" --include='*manifest*.json' >/dev/null 2>&1; then
    fail "Manifeste sans /api/health — build incomplet"
  fi
fi
log "Manifeste contient api/health"

log "Switch current → ${RELEASE_DIR}"
ln -sfn "${RELEASE_DIR}" "${CURRENT_LINK}.tmp"
mv -Tf "${CURRENT_LINK}.tmp" "${CURRENT_LINK}"

cp -f "${RELEASE_DIR}/ecosystem.config.cjs" "${ECOSYSTEM}"
export VPS_APP_PATH="${APP_ROOT}"
export AFD_RELEASE_SHA="${FULL_SHA}"
export GIT_SHA="${FULL_SHA}"
mkdir -p "${LOGS_DIR}"
cd "${APP_ROOT}"

EXPECTED_STANDALONE="$(readlink -f "${CURRENT_LINK}/.next/standalone")"
[[ -f "${EXPECTED_STANDALONE}/server.js" ]] || fail "server.js manquant: ${EXPECTED_STANDALONE}"

# Détecter collision de port (cause réelle observée : nghttpx sur 127.0.0.1:3000)
if ss -lntp 2>/dev/null | grep -qE "127\\.0\\.0\\.1:${PORT}\\b|\\*:${PORT}\\b|0\\.0\\.0\\.0:${PORT}\\b"; then
  probe_hdr="$(curl -sS -D- -o /tmp/afd-port-probe.body --max-time 3 \
    "http://127.0.0.1:${PORT}/api/health" 2>/dev/null || true)"
  if echo "${probe_hdr}" | grep -qiE 'nghttpx|CyberPanel-OLS|Server:.*OLS'; then
    fail "Port ${PORT} occupé par nghttpx/CyberPanel (pas Node). Exécutez en root: systemctl disable --now nghttpx.service"
  fi
  # Si déjà notre app Next (JSON ok), on pourra recharger ; sinon risque EADDRINUSE
  if ! echo "${probe_hdr}" | grep -q 'HTTP/.* 200' || ! grep -q '"status":"ok"' /tmp/afd-port-probe.body 2>/dev/null; then
    log "WARN: port ${PORT} déjà en écoute — tentative pm2 delete puis bind"
  fi
fi

# Forcer un redémarrage complet : startOrReload peut conserver un ancien cwd.
# Ne jamais laisser un foreign listener (nghttpx) masquer un faux 404 HTML.
log "pm2 delete + start (cwd=${EXPECTED_STANDALONE})"
pm2 delete plateforme-afd >/dev/null 2>&1 || true
pm2 start "${ECOSYSTEM}" --env production --update-env
pm2 save

# Vérifier que PM2 exécute bien le server.js de la NOUVELLE release
PM2_CWD="$(pm2 jlist 2>/dev/null | node -e '
let d=""; process.stdin.on("data",c=>d+=c); process.stdin.on("end",()=>{
  try {
    const apps=JSON.parse(d);
    const app=apps.find(a=>a.name==="plateforme-afd");
    if(!app){ process.exit(2); }
    process.stdout.write(String(app.pm2_env?.pm_cwd||""));
  } catch { process.exit(3); }
});
' || true)"
log "pm2_cwd=${PM2_CWD}"
[[ -n "${PM2_CWD}" ]] || fail "Impossible de lire pm2 cwd"
if [[ "$(readlink -f "${PM2_CWD}")" != "${EXPECTED_STANDALONE}" ]]; then
  fail "PM2 cwd incorrect: ${PM2_CWD} != ${EXPECTED_STANDALONE}"
fi
PM2_SCRIPT="$(pm2 jlist 2>/dev/null | node -e '
let d=""; process.stdin.on("data",c=>d+=c); process.stdin.on("end",()=>{
  const apps=JSON.parse(d);
  const app=apps.find(a=>a.name==="plateforme-afd");
  process.stdout.write(String(app?.pm2_env?.pm_exec_path||app?.pm2_env?.script||""));
});
' || true)"
log "pm2_script=${PM2_SCRIPT}"
[[ "${PM2_SCRIPT}" == *"/server.js" || "${PM2_SCRIPT}" == *"server.js" ]] || fail "PM2 script inattendu: ${PM2_SCRIPT}"

log "Health local ${HEALTH_LOCAL}"
if ! wait_for_health "${HEALTH_LOCAL}" "HealthLocal" 30; then
  log "Health local KO — rollback"
  if [[ -n "${PREVIOUS_TARGET}" && -d "${PREVIOUS_TARGET}" ]]; then
    ln -sfn "${PREVIOUS_TARGET}" "${CURRENT_LINK}.tmp"
    mv -Tf "${CURRENT_LINK}.tmp" "${CURRENT_LINK}"
    pm2 delete plateforme-afd >/dev/null 2>&1 || true
    pm2 start "${ECOSYSTEM}" --env production --update-env
    pm2 save
  fi
  mv "${RELEASE_DIR}" "${RELEASE_DIR}.failed-$(date +%s)" 2>/dev/null || true
  fail "Déploiement annulé (health local)"
fi

if [[ "${SKIP_PUBLIC_CHECK}" != "1" ]]; then
  log "Health public ${HEALTH_PUBLIC}"
  if ! wait_for_health "${HEALTH_PUBLIC}" "HealthPublic" 30; then
    log "Health public KO — rollback (proxy OLS peut être absent au 1er deploy)"
    if [[ -n "${PREVIOUS_TARGET}" && -d "${PREVIOUS_TARGET}" ]]; then
      ln -sfn "${PREVIOUS_TARGET}" "${CURRENT_LINK}.tmp"
      mv -Tf "${CURRENT_LINK}.tmp" "${CURRENT_LINK}"
      pm2 delete plateforme-afd >/dev/null 2>&1 || true
      pm2 start "${ECOSYSTEM}" --env production --update-env
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
    # Ne jamais faire échouer un déploiement réussi à cause d’une purge (permissions root, etc.)
    chmod -R u+w "${old}" 2>/dev/null || true
    if ! rm -rf "${old}" 2>/tmp/afd-purge.err; then
      log "WARN: purge incomplète $(basename "${old}") (current inchangé) — $(head -c 120 /tmp/afd-purge.err 2>/dev/null | tr '\n' ' ')"
    fi
  done
fi

log "OK deploy ${STAMP} sha=${FULL_SHA}"
pm2 status plateforme-afd || true
curl -fsS --max-time 10 "${HEALTH_LOCAL}" || true
