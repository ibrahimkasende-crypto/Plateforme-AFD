#!/usr/bin/env bash
# Root only — proxy afd-rdc.org → 127.0.0.1:3000
# Cause réelle du rollback précédent :
#   [ERROR] context:/.well-known/ path is not accessible: .../public_html/.well-known/
# + lshttpd -t peut renvoyer !=0 sur WARN (license/Example) → ne pas traiter WARN comme ERROR.
set -Eeuo pipefail
[[ "$(id -u)" -eq 0 ]] || { echo "ERREUR: root requis"; exit 1; }

DOMAIN="afd-rdc.org"
BACKEND="127.0.0.1:3000"
EXT_NAME="plateforme-afd"
LSWSDIR="/usr/local/lsws"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_ROOT="/root/ols-afd-proxy-backup-${STAMP}"
LOG="/tmp/ols-afd-proxy-${STAMP}.log"
ln -sfn "${LOG}" /tmp/ols-afd-proxy-latest.log
exec > >(tee -a "${LOG}") 2>&1

log(){ printf '[%s] %s\n' "$(date -u +%H:%M:%SZ)" "$*"; }
fail(){ log "ERREUR: $*"; exit 1; }

VHOST_DIR="${LSWSDIR}/conf/vhosts/${DOMAIN}"
VHCONF="${VHOST_DIR}/vhost.conf"
[[ -f "${VHCONF}" ]] || fail "manquant: ${VHCONF}"

curl -fsS --max-time 5 "http://${BACKEND}/api/health" | grep -q '"status":"ok"' \
  || fail "backend local KO"

mkdir -p "${BACKUP_ROOT}"
cp -a "${VHCONF}" "${BACKUP_ROOT}/"
cp -a "${VHOST_DIR}" "${BACKUP_ROOT}/vhost-dir"
cp -a "${LSWSDIR}/conf/httpd_config.conf" "${BACKUP_ROOT}/" || true
log "BACKUP=${BACKUP_ROOT}"
log "VHCONF=${VHCONF}"

log "--- before excerpt ---"
grep -nE 'extprocessor|context |docRoot|rewrite|handler|address' "${VHCONF}" | head -80 || true

export VHCONF EXT_NAME BACKEND STAMP
python3 - <<'PY'
from pathlib import Path
import re, os

vh = Path(os.environ["VHCONF"])
ext_name = os.environ["EXT_NAME"]
backend = os.environ["BACKEND"]
stamp = os.environ["STAMP"]
text = vh.read_text(encoding="utf-8", errors="replace")

def remove_blocks(src: str, header_re: str) -> str:
    out = []
    i = 0
    lines = src.splitlines(keepends=True)
    hdr = re.compile(header_re)
    while i < len(lines):
        if hdr.match(lines[i].rstrip("\n")):
            depth = lines[i].count("{") - lines[i].count("}")
            while depth <= 0 and i + 1 < len(lines):
                i += 1
                depth += lines[i].count("{") - lines[i].count("}")
            while depth > 0 and i + 1 < len(lines):
                i += 1
                depth += lines[i].count("{") - lines[i].count("}")
            i += 1
            continue
        out.append(lines[i])
        i += 1
    return "".join(out)

# Retirer uniquement nos blocs managés (ne PAS toucher acme-challenge existant)
text = remove_blocks(text, rf"^extprocessor\s+{re.escape(ext_name)}\b")
text = remove_blocks(text, r"^context\s+/\s*$")
text = remove_blocks(text, r"^context\s+/\s*\{")
# Ancien contexte cassé ajouté par script précédent (exactement /.well-known/ seulement)
text = remove_blocks(text, r"^context\s+/\.well-known/\s*$")
text = remove_blocks(text, r"^context\s+/\.well-known/\s*\{")
# Nettoyer marqueurs managed
text = re.sub(r"(?m)^# --- Plateforme-AFD Next\.js reverse proxy.*\n?", "", text)
text = re.sub(r"\n{3,}", "\n\n", text).rstrip() + "\n\n"

addon = f"""# --- Plateforme-AFD Next.js reverse proxy (managed {stamp}) ---
extprocessor {ext_name} {{
  type                    proxy
  address                 {backend}
  maxConns                200
  pcKeepAliveTimeout      60
  initTimeout             60
  retryTimeout            0
  respBuffer              0
}}

context / {{
  type                    proxy
  handler                 {ext_name}
  addDefaultCharset       off
}}
"""
vh.write_text(text + addon, encoding="utf-8")
print("UPDATED", vh)
PY

log "--- after excerpt ---"
grep -nE 'extprocessor|context |handler|address|acme|plateforme' "${VHCONF}" | head -80 || true

rollback() {
  log "ROLLBACK depuis ${BACKUP_ROOT}"
  rm -rf "${VHOST_DIR}"
  cp -a "${BACKUP_ROOT}/vhost-dir" "${VHOST_DIR}"
  "${LSWSDIR}/bin/lswsctrl" restart || true
}

log "Validation lshttpd -t (ERROR only = failure; WARN ignored)"
VALIDATE_OUT="$(mktemp)"
set +e
"${LSWSDIR}/bin/lshttpd" -t >"${VALIDATE_OUT}" 2>&1
set -e
cat "${VALIDATE_OUT}"

# Ignorer WARN Example / license ; échouer seulement sur ERROR
if grep -E '\[ERROR\]' "${VALIDATE_OUT}" | grep -vq 'Example'; then
  # Any ERROR not solely about Example
  if grep -E '\[ERROR\]' "${VALIDATE_OUT}" >/dev/null; then
    log "ERROR détecté dans la validation"
    grep -E '\[ERROR\]' "${VALIDATE_OUT}" || true
    rollback
    fail "validation OLS échouée (ERROR)"
  fi
fi
if grep -E "\[ERROR\].*afd-rdc\.org|\[ERROR\].*plateforme-afd|\[ERROR\].*well-known" "${VALIDATE_OUT}" >/dev/null; then
  grep -E '\[ERROR\]' "${VALIDATE_OUT}" || true
  rollback
  fail "validation OLS échouée (ERROR afd-rdc.org)"
fi
# Si ERROR générique autre que Example
if grep -E '\[ERROR\]' "${VALIDATE_OUT}" >/dev/null; then
  if grep -E '\[ERROR\]' "${VALIDATE_OUT}" | grep -v 'Example' >/dev/null; then
    grep -E '\[ERROR\]' "${VALIDATE_OUT}" || true
    rollback
    fail "validation OLS échouée (ERROR non-Example)"
  fi
fi
log "Validation OK (pas d'ERROR bloquant)"

log "Graceful restart OLS"
"${LSWSDIR}/bin/lswsctrl" restart
sleep 3

BODY="$(mktemp)"
CODE="$(curl -sS -o "${BODY}" -w '%{http_code}' --max-time 25 "https://${DOMAIN}/api/health" || echo 000)"
HDR="$(curl -sS -D- -o /dev/null --max-time 25 -I "https://${DOMAIN}/" | tr -d '\r' || true)"
log "health_code=${CODE} body=$(head -c 220 "${BODY}" | tr '\n' ' ')"
log "home_headers=$(printf '%s' "${HDR}" | tr '\n' '|')"

if [[ "${CODE}" != "200" ]] || ! grep -q '"status":"ok"' "${BODY}"; then
  rollback
  fail "health public KO — rollback effectué"
fi

log "SUCCESS https://${DOMAIN}/api/health → 200 JSON"
log "LOG=${LOG} BACKUP=${BACKUP_ROOT}"
echo OK
