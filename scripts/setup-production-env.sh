#!/usr/bin/env bash
# =============================================================================
# Plateforme-AFD — création unique de shared/.env.production sur le VPS
#
# Usage (une seule fois, en root ou avec droits sur le chemin) :
#   sudo bash scripts/setup-production-env.sh
#   # ou :
#   VPS_APP_PATH=/home/afd-rdc.org/apps/plateforme-afd \
#     bash scripts/setup-production-env.sh
#
# Ne contient AUCUNE vraie valeur secrète.
# =============================================================================
set -Eeuo pipefail

APP_ROOT="${VPS_APP_PATH:-/home/afd-rdc.org/apps/plateforme-afd}"
APP_USER="${VPS_APP_USER:-afdrd7787}"
APP_GROUP="${VPS_APP_GROUP:-afdrd7787}"
SHARED_DIR="${APP_ROOT}/shared"
ENV_FILE="${SHARED_DIR}/.env.production"
EXAMPLE_CANDIDATES=(
  "${APP_ROOT}/repo/.env.production.example"
  "${APP_ROOT}/current/.env.production.example"
  "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/.env.production.example"
)

log() { printf '[setup-env] %s\n' "$*"; }
fail() { printf '[setup-env][ERREUR] %s\n' "$*" >&2; exit 1; }

if [[ "$(id -u)" -ne 0 ]]; then
  if [[ ! -w "${APP_ROOT}" ]] 2>/dev/null; then
    fail "Exécutez en root (sudo) ou avec droits d'écriture sur ${APP_ROOT}"
  fi
fi

command -v install >/dev/null || fail "install introuvable"
mkdir -p "${SHARED_DIR}" "${APP_ROOT}/logs" "${APP_ROOT}/releases"

EXAMPLE=""
for c in "${EXAMPLE_CANDIDATES[@]}"; do
  if [[ -f "${c}" ]]; then
    EXAMPLE="${c}"
    break
  fi
done
[[ -n "${EXAMPLE}" ]] || fail "Aucun .env.production.example trouvé"

if [[ -f "${ENV_FILE}" ]]; then
  log "Fichier déjà présent : ${ENV_FILE}"
  log "Aucune valeur ne sera affichée. Ouvrez-le pour édition si besoin."
else
  install -m 600 "${EXAMPLE}" "${ENV_FILE}"
  log "Créé depuis le modèle : ${EXAMPLE}"
fi

# Édition interactive (nano si disponible, sinon vi)
EDITOR_BIN="${EDITOR:-}"
if [[ -z "${EDITOR_BIN}" ]]; then
  if command -v nano >/dev/null; then EDITOR_BIN=nano
  elif command -v vi >/dev/null; then EDITOR_BIN=vi
  else fail "Aucun éditeur (nano/vi). Définissez EDITOR=..."
  fi
fi

log "Éditez les valeurs sensibles maintenant (elles ne seront pas réaffichées)."
"${EDITOR_BIN}" "${ENV_FILE}"

# Permissions strictes
if id "${APP_USER}" >/dev/null 2>&1; then
  chown "${APP_USER}:${APP_GROUP}" "${ENV_FILE}"
  chown "${APP_USER}:${APP_GROUP}" "${SHARED_DIR}"
  chown -R "${APP_USER}:${APP_GROUP}" "${APP_ROOT}/logs" 2>/dev/null || true
else
  log "Attention: utilisateur ${APP_USER} introuvable — chown ignoré"
fi
chmod 700 "${SHARED_DIR}"
chmod 600 "${ENV_FILE}"

# Vérifications sans afficher le contenu
[[ -f "${ENV_FILE}" ]] || fail "Fichier manquant après édition"
PERM="$(stat -c '%a' "${ENV_FILE}" 2>/dev/null || stat -f '%OLp' "${ENV_FILE}")"
[[ "${PERM}" == "600" ]] || fail "Permissions attendues 600, obtenu ${PERM}"
OWNER="$(stat -c '%U' "${ENV_FILE}" 2>/dev/null || true)"
if [[ -n "${OWNER}" && "${OWNER}" != "${APP_USER}" ]]; then
  fail "Propriétaire attendu ${APP_USER}, obtenu ${OWNER}"
fi

# Contrôles de présence (noms uniquement, jamais les valeurs)
required_keys=(
  NEXT_PUBLIC_SITE_URL
  NEXT_PUBLIC_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
)
missing=0
for key in "${required_keys[@]}"; do
  if ! grep -qE "^${key}=.+" "${ENV_FILE}"; then
    log "Clé manquante ou vide : ${key}"
    missing=1
  fi
done
# Au moins une clé publique Supabase
if ! grep -qE '^NEXT_PUBLIC_SUPABASE_(PUBLISHABLE|ANON)_KEY=.+' "${ENV_FILE}"; then
  log "Clé manquante : NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY"
  missing=1
fi
[[ "${missing}" == "0" ]] || fail "Complétez les clés manquantes puis relancez"

log "OK — ${ENV_FILE} (chmod 600, owner ${APP_USER})"
log "Ce fichier ne doit jamais être commité ni copié durablement dans une release."
log "Le script deploy-production.sh crée un lien symbolique par release."
