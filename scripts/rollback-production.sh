#!/usr/bin/env bash
# =============================================================================
# Rollback production — Plateforme-AFD
#
# Usage :
#   VPS_APP_PATH=/home/afd-rdc.org/apps/plateforme-afd \
#     bash scripts/rollback-production.sh previous
#   bash scripts/rollback-production.sh list
#   bash scripts/rollback-production.sh 20260809-101500
# =============================================================================
set -Eeuo pipefail

log() { printf '[rollback %s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"; }
fail() { printf '[rollback][ERREUR] %s\n' "$*" >&2; exit 1; }

TARGET="${1:-previous}"
APP_ROOT="${VPS_APP_PATH:-}"
[[ -n "${APP_ROOT}" ]] || fail "VPS_APP_PATH non défini"
APP_ROOT="$(cd "${APP_ROOT}" && pwd)"
PORT="${PORT:-3000}"
HEALTH_LOCAL="${HEALTH_LOCAL:-http://127.0.0.1:${PORT}/api/health}"
CURRENT_LINK="${APP_ROOT}/current"
ECOSYSTEM="${APP_ROOT}/ecosystem.config.cjs"

list_releases() {
  ls -1dt "${APP_ROOT}/releases"/* 2>/dev/null || true
}

if [[ "${TARGET}" == "list" ]]; then
  echo "Current: $(readlink -f "${CURRENT_LINK}" 2>/dev/null || echo none)"
  echo "Releases:"
  list_releases | while read -r r; do echo "  $(basename "${r}")  ${r}"; done
  exit 0
fi

[[ -L "${CURRENT_LINK}" ]] || fail "current n'est pas un symlink"
BEFORE="$(readlink -f "${CURRENT_LINK}")"
log "current_before=${BEFORE}"

mapfile -t RELEASES < <(list_releases)
((${#RELEASES[@]} >= 1)) || fail "Aucune release"

DEST=""
if [[ "${TARGET}" == "previous" ]]; then
  for r in "${RELEASES[@]}"; do
    if [[ "$(readlink -f "${r}")" != "${BEFORE}" ]]; then
      DEST="$(readlink -f "${r}")"
      break
    fi
  done
  [[ -n "${DEST}" ]] || fail "Aucune release précédente disponible"
else
  CANDIDATE="${APP_ROOT}/releases/${TARGET}"
  [[ -d "${CANDIDATE}" ]] || fail "Release introuvable: ${TARGET}"
  DEST="$(readlink -f "${CANDIDATE}")"
fi

[[ -f "${DEST}/.next/standalone/server.js" ]] || fail "standalone invalide dans ${DEST}"

log "Switch current → ${DEST}"
ln -sfn "${DEST}" "${CURRENT_LINK}.tmp"
mv -Tf "${CURRENT_LINK}.tmp" "${CURRENT_LINK}"

export VPS_APP_PATH="${APP_ROOT}"
pm2 startOrReload "${ECOSYSTEM}" --env production --update-env
pm2 save
sleep 2

if ! curl -fsS --max-time 20 "${HEALTH_LOCAL}" | grep -q '"status":"ok"'; then
  log "Health KO — restauration ${BEFORE}"
  ln -sfn "${BEFORE}" "${CURRENT_LINK}.tmp"
  mv -Tf "${CURRENT_LINK}.tmp" "${CURRENT_LINK}"
  pm2 startOrReload "${ECOSYSTEM}" --env production --update-env
  pm2 save
  fail "Rollback échoué — ancienne cible restaurée"
fi

log "OK rollback → ${DEST}"
pm2 status plateforme-afd || true
