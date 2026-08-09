#!/usr/bin/env bash
# =============================================================================
# Root only — reverse proxy OpenLiteSpeed : afd-rdc.org → 127.0.0.1:3000
# Sauvegarde → configure → valide → restart → test → rollback si échec
# Ne touche PAS DNS / MX / SPF / DKIM / DMARC / email / certificats SSL.
# =============================================================================
set -Eeuo pipefail

[[ "$(id -u)" -eq 0 ]] || { echo "ERREUR: exécuter en root (sudo)"; exit 1; }

DOMAIN="afd-rdc.org"
BACKEND="127.0.0.1:3000"
EXT_NAME="plateforme-afd"
PUBLIC_HTML="/home/afd-rdc.org/public_html"
LSWSDIR="/usr/local/lsws"
HTTPD_CONF="${LSWSDIR}/conf/httpd_config.conf"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_ROOT="/root/ols-afd-proxy-backup-${STAMP}"
LOG="/root/ols-afd-proxy-${STAMP}.log"

exec > >(tee -a "${LOG}") 2>&1

log() { printf '[ols-proxy %s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"; }
fail() { printf '[ols-proxy][ERREUR] %s\n' "$*" >&2; exit 1; }

command -v curl >/dev/null || fail "curl manquant"
command -v python3 >/dev/null || fail "python3 manquant"
[[ -x "${LSWSDIR}/bin/lshttpd" ]] || fail "lshttpd introuvable"
[[ -x "${LSWSDIR}/bin/lswsctrl" ]] || fail "lswsctrl introuvable"

curl -fsS --max-time 5 "http://${BACKEND}/api/health" | grep -q '"status":"ok"' \
  || fail "Backend http://${BACKEND}/api/health KO — PM2 doit être online"

VHOST_DIR="${LSWSDIR}/conf/vhosts/${DOMAIN}"
[[ -d "${VHOST_DIR}" ]] || fail "Dossier vhost introuvable: ${VHOST_DIR}"

VHCONF=""
for f in "${VHOST_DIR}/vhost.conf" "${VHOST_DIR}/vhconf.conf"; do
  [[ -f "${f}" ]] && VHCONF="${f}" && break
done
[[ -n "${VHCONF}" ]] || fail "Aucun vhost.conf/vhconf.conf dans ${VHOST_DIR}"

log "VHCONF=${VHCONF}"
log "BACKUP_ROOT=${BACKUP_ROOT}"
mkdir -p "${BACKUP_ROOT}"
cp -a "${VHCONF}" "${BACKUP_ROOT}/"
cp -a "${HTTPD_CONF}" "${BACKUP_ROOT}/" 2>/dev/null || true
cp -a "${VHOST_DIR}" "${BACKUP_ROOT}/vhost-dir"
printf '%s\n' "${VHCONF}" > "${BACKUP_ROOT}/VHCONF_PATH.txt"

rollback() {
  log "ROLLBACK depuis ${BACKUP_ROOT}"
  if [[ -d "${BACKUP_ROOT}/vhost-dir" ]]; then
    rm -rf "${VHOST_DIR}"
    cp -a "${BACKUP_ROOT}/vhost-dir" "${VHOST_DIR}"
  fi
  "${LSWSDIR}/bin/lswsctrl" restart || true
  log "Rollback appliqué — backup conservé: ${BACKUP_ROOT}"
}

python3 - <<PY
from pathlib import Path
import re

path = Path(${VHCONF@Q})
ext_name = ${EXT_NAME@Q}
backend = ${BACKEND@Q}
public_html = ${PUBLIC_HTML@Q}
text = path.read_text(encoding="utf-8", errors="replace")

def remove_named_blocks(src: str, header_re: str) -> str:
    out = []
    i = 0
    lines = src.splitlines(keepends=True)
    hdr = re.compile(header_re)
    while i < len(lines):
        if hdr.match(lines[i].rstrip("\n")):
            block = [lines[i]]
            depth = lines[i].count("{") - lines[i].count("}")
            # header line without brace → next line likely "{"
            while depth <= 0 and i + 1 < len(lines):
                i += 1
                block.append(lines[i])
                depth += lines[i].count("{") - lines[i].count("}")
            while depth > 0 and i + 1 < len(lines):
                i += 1
                block.append(lines[i])
                depth += lines[i].count("{") - lines[i].count("}")
            i += 1
            continue
        out.append(lines[i])
        i += 1
    return "".join(out)

# Remove previous managed blocks
text = remove_named_blocks(text, rf"^extprocessor\s+{re.escape(ext_name)}\b")
text = remove_named_blocks(text, r"^context\s+/\s*$")
text = remove_named_blocks(text, r"^context\s+/\s*\{")
text = remove_named_blocks(text, r"^context\s+/\.well-known/")
text = re.sub(r"\n{3,}", "\n\n", text).rstrip() + "\n\n"

addon = f"""# --- Plateforme-AFD Next.js reverse proxy (managed) ---
extprocessor {ext_name} {{
  type                    proxy
  address                 {backend}
  maxConns                100
  pcKeepAliveTimeout      60
  initTimeout             60
  retryTimeout            0
  respBuffer              0
}}

context /.well-known/ {{
  location                {public_html}/.well-known/
  allowBrowse             1
  addDefaultCharset       off
}}

context / {{
  type                    proxy
  handler                 {ext_name}
  addDefaultCharset       off
}}
"""
path.write_text(text + addon, encoding="utf-8")
print("VHCONF_UPDATED")
PY

log "Configuration écrite"
log "Validation: lshttpd -t"
if ! "${LSWSDIR}/bin/lshttpd" -t; then
  rollback
  fail "Configuration OLS invalide — rollback effectué"
fi
log "Validation OK"

log "Graceful restart OLS"
"${LSWSDIR}/bin/lswsctrl" restart
sleep 3

HEALTH_BODY="$(mktemp)"
HEALTH_CODE="$(curl -sS -o "${HEALTH_BODY}" -w '%{http_code}' --max-time 25 "https://${DOMAIN}/api/health" || echo 000)"
HOME_HEADERS="$(curl -sS -D- -o /dev/null --max-time 25 -I "https://${DOMAIN}/" || true)"
HOME_CODE="$(printf '%s' "${HOME_HEADERS}" | awk 'NR==1{print $2}')"
log "health_http=${HEALTH_CODE}"
log "health_body=$(head -c 240 "${HEALTH_BODY}" | tr '\n' ' ')"
log "home_http=${HOME_CODE}"
log "home_headers=$(printf '%s' "${HOME_HEADERS}" | tr '\r' ' ' | tr '\n' '|' | head -c 400)"

if [[ "${HEALTH_CODE}" != "200" ]] || ! grep -q '"status":"ok"' "${HEALTH_BODY}"; then
  rollback
  fail "Health public KO — configuration restaurée (backup ${BACKUP_ROOT})"
fi

# Doit être Next, pas le placeholder CyberPanel
if printf '%s' "${HOME_HEADERS}" | grep -qi 'x-powered-by: next.js'; then
  log "Home servi par Next.js"
elif [[ "${HOME_CODE}" == "200" ]] || [[ "${HOME_CODE}" == "307" ]] || [[ "${HOME_CODE}" == "308" ]]; then
  log "Home HTTP ${HOME_CODE} (pas de X-Powered-By Next visible — accepter si health OK)"
else
  rollback
  fail "Home public inattendu HTTP ${HOME_CODE} — rollback"
fi

log "SUCCESS https://${DOMAIN} → http://${BACKEND}"
log "Backup: ${BACKUP_ROOT}"
log "Rollback manuel: cp -a ${BACKUP_ROOT}/vhost-dir/. ${VHOST_DIR}/ && ${LSWSDIR}/bin/lswsctrl restart"
echo "OK"
