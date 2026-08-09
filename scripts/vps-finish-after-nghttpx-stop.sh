#!/usr/bin/env bash
# =============================================================================
# À exécuter en afdrd7787 APRÈS :
#   sudo systemctl disable --now nghttpx.service
# =============================================================================
set -Eeuo pipefail

APP=/home/afd-rdc.org/apps/plateforme-afd
export VPS_APP_PATH="$APP"
export GIT_SHA
export AFD_RELEASE_SHA

echo "=== verify port 3000 free ==="
if ss -lntp 2>/dev/null | grep -q '127.0.0.1:3000'; then
  code=$(curl -sS -o /tmp/p3000.body -w '%{http_code}' --max-time 3 http://127.0.0.1:3000/api/health || true)
  powered=$(grep -i 'X-Powered-By\|Server:' /tmp/p3000.body 2>/dev/null || true)
  # If something still answers with CyberPanel/nghttpx, abort
  hdr=$(curl -sS -D- -o /dev/null --max-time 3 http://127.0.0.1:3000/api/health || true)
  if echo "$hdr" | grep -qiE 'nghttpx|CyberPanel-OLS'; then
    echo "ERREUR: 127.0.0.1:3000 toujours tenu par nghttpx/CyberPanel. Arrêtez nghttpx d'abord."
    exit 1
  fi
fi

# Restaurer la dernière release failed (build OK) si current cassé
if [[ ! -e "$APP/current/.next/standalone/server.js" ]]; then
  latest_failed=$(ls -1dt "$APP/releases"/*.failed-* 2>/dev/null | head -1 || true)
  [[ -n "$latest_failed" ]] || { echo "Aucune release .failed à restaurer"; exit 1; }
  restored="${latest_failed%%.failed-*}"
  echo "Restore $latest_failed -> $restored"
  mv "$latest_failed" "$restored"
  ln -sfn "$restored" "$APP/current.tmp"
  mv -Tf "$APP/current.tmp" "$APP/current"
fi

RELEASE=$(readlink -f "$APP/current")
GIT_SHA=$(awk -F= '/^SHA=/{print $2; exit}' "$RELEASE/RELEASE_VERSION" 2>/dev/null || echo unknown)
AFD_RELEASE_SHA="$GIT_SHA"
export GIT_SHA AFD_RELEASE_SHA

echo "RELEASE=$RELEASE SHA=$GIT_SHA"
test -f "$RELEASE/.next/standalone/server.js"
test -d "$RELEASE/.next/standalone/.next/server/app/api/health"

cp -f "$RELEASE/ecosystem.config.cjs" "$APP/ecosystem.config.cjs"
pm2 delete plateforme-afd >/dev/null 2>&1 || true
pm2 start "$APP/ecosystem.config.cjs" --env production --update-env
pm2 save

echo "=== pm2 ==="
pm2 describe plateforme-afd | sed -n '1,40p'
echo "=== ss ==="
ss -lntp | grep 3000 || true
echo "=== health ==="
curl -i --max-time 10 http://127.0.0.1:3000/api/health
echo
curl -I --max-time 10 http://127.0.0.1:3000/ | head -n 15
