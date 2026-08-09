#!/usr/bin/env bash
# =============================================================================
# Plateforme-AFD — déploiement CyberPanel (Next.js standalone + PM2)
# À exécuter SUR LE VPS, depuis le dépôt applicatif.
#
# Usage :
#   chmod +x scripts/deploy-cyberpanel.sh
#   APP_ROOT=/home/afd-rdc.org/application ./scripts/deploy-cyberpanel.sh
#
# Variables optionnelles :
#   APP_ROOT          Chemin racine de l’app (défaut: répertoire parent de scripts/)
#   RELEASES_DIR      Défaut: $APP_ROOT/../releases
#   KEEP_RELEASES     Nombre de releases à conserver (défaut: 5)
#   HEALTH_URL        Défaut: http://127.0.0.1:3000/api/health
#   PUBLIC_URL        Défaut: https://afd-rdc.org/api/health
#   SKIP_PUBLIC_CHECK=1  Ne pas vérifier l’URL publique (proxy pas encore prêt)
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="${APP_ROOT:-$(cd "${SCRIPT_DIR}/.." && pwd)}"
RELEASES_DIR="${RELEASES_DIR:-$(cd "${APP_ROOT}/.." && pwd)/releases}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000/api/health}"
PUBLIC_URL="${PUBLIC_URL:-https://afd-rdc.org/api/health}"
STAMP="$(date +%Y%m%d-%H%M%S)"
RELEASE_PATH="${RELEASES_DIR}/${STAMP}"
CURRENT_LINK="$(cd "${APP_ROOT}/.." && pwd)/current"
PREVIOUS_LINK="$(cd "${APP_ROOT}/.." && pwd)/previous"
BACKUP_DIR="$(cd "${APP_ROOT}/.." && pwd)/backups/${STAMP}"

log() { printf '[deploy] %s\n' "$*"; }
fail() { printf '[deploy][ERREUR] %s\n' "$*" >&2; exit 1; }

log "APP_ROOT=${APP_ROOT}"
[[ -f "${APP_ROOT}/package.json" ]] || fail "package.json introuvable dans APP_ROOT"
[[ -f "${APP_ROOT}/.env.production" ]] || fail ".env.production manquant — copiez .env.production.example"
command -v node >/dev/null || fail "node introuvable"
command -v npm >/dev/null || fail "npm introuvable"
command -v pm2 >/dev/null || fail "pm2 introuvable — npm install -g pm2"

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [[ "${NODE_MAJOR}" -lt 20 || "${NODE_MAJOR}" -gt 24 ]]; then
  fail "Node ${NODE_MAJOR} hors plage supportée (>=20 <=24). Node actuel: $(node -v)"
fi

mkdir -p "${RELEASES_DIR}" "${BACKUP_DIR}" "$(dirname "${CURRENT_LINK}")" "${APP_ROOT}/logs"

# 1) Sauvegarde version courante (si déjà déployée)
if [[ -d "${APP_ROOT}/.next" ]]; then
  log "Sauvegarde .next → ${BACKUP_DIR}/next"
  cp -a "${APP_ROOT}/.next" "${BACKUP_DIR}/next" || true
fi
if [[ -f "${APP_ROOT}/ecosystem.config.cjs" ]]; then
  cp -a "${APP_ROOT}/ecosystem.config.cjs" "${BACKUP_DIR}/" || true
fi
cp -a "${APP_ROOT}/.env.production" "${BACKUP_DIR}/.env.production" 2>/dev/null || true

# 2) Marquer previous = current
if [[ -L "${CURRENT_LINK}" || -d "${CURRENT_LINK}" ]]; then
  rm -rf "${PREVIOUS_LINK}"
  cp -a "${CURRENT_LINK}" "${PREVIOUS_LINK}" 2>/dev/null || ln -sfn "$(readlink -f "${CURRENT_LINK}" 2>/dev/null || echo "${APP_ROOT}")" "${PREVIOUS_LINK}" || true
fi

# 3) Préparer release (copie code actuel hors node_modules/.next pour archive)
log "Préparation release ${RELEASE_PATH}"
mkdir -p "${RELEASE_PATH}"
# On build dans APP_ROOT (working tree), puis on archive le standalone
cd "${APP_ROOT}"

# 4) Dépendances
log "npm ci"
npm ci

# 5) Build — arrêt immédiat si échec
log "npm run build"
if ! npm run build; then
  fail "Build échoué — PM2 non redémarré. Version précédente intacte."
fi

# 6) Préparer standalone
log "prepare-standalone"
node scripts/prepare-standalone.mjs

# 7) Archiver standalone dans releases/
log "Archive standalone → ${RELEASE_PATH}"
mkdir -p "${RELEASE_PATH}/standalone"
cp -a "${APP_ROOT}/.next/standalone/." "${RELEASE_PATH}/standalone/"
cp -a "${APP_ROOT}/ecosystem.config.cjs" "${RELEASE_PATH}/"
# Pointer current vers cette release (métadonnée)
ln -sfn "${RELEASE_PATH}" "${CURRENT_LINK}"

# 8) Redémarrer PM2 uniquement après succès build
log "pm2 reload / start"
cd "${APP_ROOT}"
if pm2 describe plateforme-afd >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
fi
pm2 save

# 9) Vérification locale
sleep 3
log "Health local ${HEALTH_URL}"
if ! curl -fsS --max-time 20 "${HEALTH_URL}" >/dev/null; then
  fail "Health local KO — lancez le rollback (docs/CYBERPANEL_ROLLBACK.md)"
fi
log "Health local OK"

# 10) Vérification publique (optionnelle)
if [[ "${SKIP_PUBLIC_CHECK:-0}" != "1" ]]; then
  log "Health public ${PUBLIC_URL}"
  if ! curl -fsS --max-time 30 "${PUBLIC_URL}" >/dev/null; then
    log "ATTENTION: health public KO (proxy/SSL ?). App locale OK."
  else
    log "Health public OK"
  fi
fi

# 11) Rotation releases
log "Rotation releases (keep=${KEEP_RELEASES})"
mapfile -t ALL_RELEASES < <(ls -1dt "${RELEASES_DIR}"/* 2>/dev/null || true)
if ((${#ALL_RELEASES[@]} > KEEP_RELEASES)); then
  for old in "${ALL_RELEASES[@]:KEEP_RELEASES}"; do
    log "Suppression ancienne release ${old}"
    rm -rf "${old}"
  done
fi

log "Déploiement terminé — release ${STAMP}"
log "Backup: ${BACKUP_DIR}"
pm2 status plateforme-afd || true
