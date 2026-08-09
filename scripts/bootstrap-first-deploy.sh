#!/usr/bin/env bash
# =============================================================================
# Une seule commande — premier déploiement VPS (utilisateur afdrd7787)
#
# Usage :
#   bash <(curl -fsSL ...)   # non
#   Depuis une session SSH déjà ouverte en afdrd7787 :
#     bash /tmp/bootstrap-first-deploy.sh
#   ou copier-coller le bloc ci-dessous.
# =============================================================================
set -Eeuo pipefail

APP_ROOT=/home/afd-rdc.org/apps/plateforme-afd
REPO_SSH=git@github-afd:ibrahimkasende-crypto/Plateforme-AFD.git
export VPS_APP_PATH="${APP_ROOT}"
export VPS_REPO_SSH_URL="${REPO_SSH}"
export VPS_DEPLOY_BRANCH=main
export SKIP_PUBLIC_CHECK="${SKIP_PUBLIC_CHECK:-1}"
export RUN_TYPECHECK="${RUN_TYPECHECK:-0}"
export RUN_LINT="${RUN_LINT:-0}"
export RUN_TEST="${RUN_TEST:-0}"

[[ "$(id -un)" == "afdrd7787" ]] || { echo "Connectez-vous en afdrd7787"; exit 1; }

mkdir -p "${APP_ROOT}"/{releases,shared,logs,repo}

if [[ ! -d "${APP_ROOT}/repo/.git" ]]; then
  git clone "${REPO_SSH}" "${APP_ROOT}/repo"
fi

cd "${APP_ROOT}/repo"
git remote set-url origin "${REPO_SSH}"
git fetch --prune origin
git checkout main
git reset --hard origin/main

# Permissions env (ne lit pas les valeurs)
ENV_FILE="${APP_ROOT}/shared/.env.production"
[[ -f "${ENV_FILE}" ]] || { echo "Manquant: ${ENV_FILE}"; exit 1; }
chmod 600 "${ENV_FILE}"
chown afdrd7787:afdrd7787 "${ENV_FILE}" 2>/dev/null || true

cp -f "${APP_ROOT}/repo/ecosystem.config.cjs" "${APP_ROOT}/ecosystem.config.cjs"
bash "${APP_ROOT}/repo/scripts/deploy-production.sh"

pm2 status
curl -fsS http://127.0.0.1:3000/api/health
curl -I http://127.0.0.1:3000 | head -n 5

echo "---"
echo "PM2 startup (exécuter la commande root affichée si proposée) :"
pm2 save
pm2 startup systemd -u afdrd7787 --hp /home/afd-rdc.org || true

echo "OK bootstrap — configurer ensuite le proxy OLS (docs/CYBERPANEL_OPENLITESPEED_FINAL_SETUP.md)"
