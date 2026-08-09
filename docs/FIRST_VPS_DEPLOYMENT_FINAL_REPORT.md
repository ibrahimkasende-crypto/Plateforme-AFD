# Rapport final — premier déploiement VPS

Date : 2026-08-09  
VPS : `afdrd7787@187.55.230.121`  
App : `/home/afd-rdc.org/apps/plateforme-afd`

## 1. Cause réelle du HTTP 404

**`nghttpx.service`** occupait `127.0.0.1:3000` et proxifiait vers OpenLiteSpeed `:80`.

Réponse observée avant correction :

```http
HTTP/1.1 404 Not Found
Content-Type: text/html
X-Powered-By: CyberPanel-OLS/2.5.0
Server: nghttpx
```

Ce n’était **pas** une absence de route Next `/api/health`.

## 2–4. Processus / PM2 / release

| Point | Avant | Après |
|---|---|---|
| Port 3000 | `nghttpx` → OLS:80 | `next-server` pid **84883** |
| PM2 | `errored` / `EADDRINUSE` | **online** |
| Release | `...79572536c98c.failed-*` | restaurée → `current` |
| SHA | `79572536c98c5602a2d7fbb51a7ea997f95f4228` | actif |
| Manifeste health | présent | confirmé |
| cwd PM2 | `.../current/.next/standalone` | OK |
| script | `.../standalone/server.js` | OK |

## 5–8. Corrections appliquées

1. `systemctl disable --now nghttpx.service` (root)
2. Restauration release failed → `current`
3. `pm2 delete` + `pm2 start ecosystem.config.cjs --env production`
4. `pm2 save`
5. Script deploy : détection collision nghttpx (`scripts/deploy-production.sh`)
6. Script reprise : `scripts/vps-finish-after-nghttpx-stop.sh`

## 9–11. Validation locale (obligatoire)

```text
pm2 status → plateforme-afd online
ss → 127.0.0.1:3000 users:(("next-server ...",pid=84883))
```

```http
GET http://127.0.0.1:3000/api/health
HTTP/1.1 200 OK
content-type: application/json

{"status":"ok","service":"plateforme-afd","timestamp":"...","version":"79572536c98c5602a2d7fbb51a7ea997f95f4228"}
```

```http
HEAD http://127.0.0.1:3000/
HTTP/1.1 200 OK
X-Powered-By: Next.js
```

## 12–14. Public / OLS / Actions

| Point | Statut |
|---|---|
| `https://afd-rdc.org/api/health` | à finaliser via reverse proxy OLS si pas encore OK |
| Reverse proxy | doc : `docs/CYBERPANEL_OPENLITESPEED_FINAL_SETUP.md` |
| GitHub Actions | workflow prêt ; secrets `VPS_*` à confirmer |
| Email / MX / SPF / DKIM | non modifiés |

## 15. Verdict

**Health local production : RÉUSSI.**  
Cause racine corrigée (`nghttpx` retiré du port 3000).  
PM2 exécute la bonne release standalone.  
Prochaine étape : proxy OpenLiteSpeed → `127.0.0.1:3000`, puis secrets Actions.
