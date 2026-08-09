# Rollback CyberPanel — Plateforme-AFD

Stratégie :

```text
/home/afd-rdc.org/
  application/          # working tree + .next courant
  releases/<stamp>/     # archives standalone
  current → releases/<stamp>
  previous → releases/<stamp-précédent>
  backups/<stamp>/      # .next + .env.production
  logs/
```

> Adapter les chemins après vérification SSH (`ls /home`). Ne jamais inventer un chemin.

---

## Quand rollbacker

- `npm run build` a réussi mais le health local échoue après reload PM2
- HTTPS public 502 après déploiement
- Régression Auth / dashboard / contact critique

---

## Rollback rapide (PM2 + backup `.next`)

```bash
# 1) Identifier les chemins réels
ls /home/
export APP_ROOT=/home/afd-rdc.org/application   # AJUSTER
export BACKUP_ROOT=/home/afd-rdc.org/backups
ls -lt "${BACKUP_ROOT}"

# 2) Choisir le backup le plus récent valide
export BACKUP="${BACKUP_ROOT}/YYYYMMDD-HHMMSS"   # AJUSTER

# 3) Restaurer .next
cd "${APP_ROOT}"
pm2 stop plateforme-afd || true
rm -rf .next
cp -a "${BACKUP}/next" .next
node scripts/prepare-standalone.mjs

# 4) Restaurer env si besoin
cp -a "${BACKUP}/.env.production" .env.production

# 5) Redémarrer
pm2 start ecosystem.config.cjs || pm2 reload ecosystem.config.cjs --update-env
pm2 save

# 6) Vérifier
curl -fsS http://127.0.0.1:3000/api/health
curl -fsS https://afd-rdc.org/api/health
```

---

## Rollback via `previous`

```bash
export BASE=/home/afd-rdc.org   # AJUSTER
ls -la "${BASE}/previous" "${BASE}/current"

# Remettre previous en current
ln -sfn "$(readlink -f "${BASE}/previous")" "${BASE}/current"

# Recopier standalone précédent dans application/.next/standalone
rm -rf "${BASE}/application/.next/standalone"
mkdir -p "${BASE}/application/.next/standalone"
cp -a "${BASE}/current/standalone/." "${BASE}/application/.next/standalone/"

cd "${BASE}/application"
pm2 reload ecosystem.config.cjs --update-env
pm2 save
curl -fsS http://127.0.0.1:3000/api/health
```

---

## Ce qu’on ne rollback PAS

- Base Supabase (PostgreSQL / Auth / Storage) — reste en place
- Comptes email `@afd-rdc.org` / DNS MX SPF DKIM
- Certificat SSL CyberPanel (sauf si vous l’avez volontairement regeneré)

---

## Après rollback

1. Noter la release fautive (`releases/<stamp>`)
2. Analyser `logs/error.log` et `pm2 logs plateforme-afd --lines 100`
3. Corriger en local → rebuild → redéployer uniquement après `npm run build` vert
