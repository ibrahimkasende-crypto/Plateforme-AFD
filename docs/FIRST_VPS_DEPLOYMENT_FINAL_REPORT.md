# Rapport final — diagnostic VPS (en cours)

Date : 2026-08-09  
VPS : `afdrd7787@187.55.230.121`  
App : `/home/afd-rdc.org/apps/plateforme-afd`

## 1. Cause réelle du HTTP 404 sur `127.0.0.1:3000/api/health`

**Le port 3000 n’était pas servi par Next.js / PM2.**

Il est occupé par le service systemd **`nghttpx.service`** (HTTP/2 proxy), avec la config d’exemple :

```text
# /etc/nghttpx/nghttpx.conf
frontend=127.0.0.1,3000;no-tls
backend=127.0.0.1,80
```

Donc `curl http://127.0.0.1:3000/api/health` interroge **nghttpx → OpenLiteSpeed:80**, qui renvoie une page HTML 404 CyberPanel :

```http
HTTP/1.1 404 Not Found
Content-Type: text/html
X-Powered-By: CyberPanel-OLS/2.5.0
Server: nghttpx
```

Ce n’est **pas** un problème de route `/api/health` manquante dans le build Next.

## 2. Processus / service sur le port 3000

| Élément | Valeur |
|---|---|
| Service | `nghttpx.service` (**active/running**) |
| Binaire | `/usr/sbin/nghttpx --conf=/etc/nghttpx/nghttpx.conf` |
| Bind | `127.0.0.1:3000` → backend `127.0.0.1:80` |
| PID visible par `afdrd7787` | masqué (`hidepid`) — `ss` sans process name |
| Preuve | headers `Server: nghttpx` + unit systemd active |

## 3. État PM2 au moment du diagnostic

| Élément | Valeur |
|---|---|
| App | `plateforme-afd` |
| Status | **errored** (pid 0, 15 restarts) |
| Erreur logs | `listen EADDRINUSE: address already in use 127.0.0.1:3000` |
| script path | `.../current/.next/standalone/server.js` |
| cwd | `.../current/.next/standalone` |

PM2 démarre correctement la bonne app, mais **échoue à binder** le port déjà pris.

## 4. Release / manifeste health

| Élément | Valeur |
|---|---|
| current (symlink) | pointait vers `.../79572536c98c` puis release renommée en `.failed-*` |
| Build standalone | **OK** (`server.js` présent) |
| Route compilée | **présente** : `.next/standalone/.next/server/app/api/health` |
| Manifeste | `"/api/health": {}` dans `functions-config-manifest.json` |
| Smoke :3010 | **OK** (Next réel) |

## 5. Correction requise (privilège root)

`afdrd7787` n’a **pas** sudo passwordless. Impossible d’arrêter `nghttpx` depuis cet utilisateur.

**Une seule commande root nécessaire :**

```bash
systemctl disable --now nghttpx.service
```

Cela n’affecte pas MX/SPF/DKIM/email (nghttpx sample 3000→80 n’est pas le listener public 443).

Ensuite, en `afdrd7787`, le script `scripts/vps-finish-after-nghttpx-stop.sh` restaure la release et démarre PM2.

## 6–15. Statuts (à compléter après arrêt nghttpx)

| # | Point | Statut |
|---|---|---|
| 6 | Correction appliquée | **en attente** `systemctl disable --now nghttpx` |
| 7 | Script deploy détecte nghttpx | **préparé** (fail explicite) |
| 8 | PM2 online sur bonne release | **en attente** |
| 9 | SHA | `79572536c98c...` (release existante) |
| 10 | PM2 status | errored → à corriger |
| 11 | Local `/api/health` | **en attente** |
| 12 | Public `/api/health` | après OLS |
| 13 | Reverse proxy | après health local |
| 14 | GitHub Actions | après health local |
| 15 | Verdict | **bloqué uniquement par nghttpx sur :3000** |
