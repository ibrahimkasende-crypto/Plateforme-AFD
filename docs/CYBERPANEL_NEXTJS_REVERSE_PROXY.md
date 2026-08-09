# Reverse proxy OpenLiteSpeed / CyberPanel → Next.js

Application : **Plateforme-AFD**  
Domaine : **https://afd-rdc.org**  
Panneau : **https://panel.afd-rdc.org:8090**  
Runtime Node : **127.0.0.1:3000** (jamais exposé publiquement)

> Ce n’est **pas** un site PHP ni un dépôt HTML dans `public_html`.  
> OpenLiteSpeed doit **proxifier** vers le process Node (PM2).

---

## Prérequis

1. L’app Next.js tourne déjà (`pm2 status plateforme-afd` → online).
2. Test local OK :
   ```bash
   curl -I http://127.0.0.1:3000/api/health
   ```
3. SSL CyberPanel déjà émis (ou à émettre à l’étape 7).

---

## 1. Identifier le virtual host réel

Dans CyberPanel → **Websites** → `afd-rdc.org` → noter le chemin document root.

Sur le VPS (SSH) :

```bash
# Lister les vhosts CyberPanel
ls /usr/local/lsws/conf/vhosts/
# Exemple typique :
ls /home/ | grep -i afd
# Document root courant (à vérifier, ne pas inventer) :
# /home/afd-rdc.org/public_html
```

Conserver `public_html` pour d’éventuels assets web directs.  
Placer le runtime Node ailleurs, par ex. :

```text
/home/afd-rdc.org/application/     # code Next + .next/standalone
/home/afd-rdc.org/logs/
/home/afd-rdc.org/backups/
/home/afd-rdc.org/releases/
```

---

## 2. External App (proxy vers Node)

CyberPanel / OpenLiteSpeed :

1. Ouvrir **WebAdmin OpenLiteSpeed** (souvent `https://IP:7080`)  
   ou éditer via CyberPanel → site → **Manage** → **VHost Conf** (selon version).
2. Virtual Host `afd-rdc.org` → **External App** → **Add**
3. Paramètres :

| Champ | Valeur |
|---|---|
| Name | `plateforme-afd` |
| Address | `127.0.0.1:3000` |
| Max Connections | `100` |
| Initial Request Timeout | `60` |
| Retry Timeout | `0` |
| Response Buffering | `No` |

Type : **Web Server** (proxy HTTP) ou **Proxy** selon l’UI.

---

## 3. Context / Proxy context

Virtual Host → **Contexts** → **Add** → type **Proxy** (ou Rewrite proxy) :

| Champ | Valeur |
|---|---|
| URI | `/` |
| External App | `plateforme-afd` |
| Accessible | `Yes` |

Objectif : **toutes** les requêtes HTTPS vers `afd-rdc.org` sont transmises à `http://127.0.0.1:3000`.

---

## 4. Headers proxy (recommandés)

Si l’UI expose « Request Header » / « Extra Headers », s’assurer que Next reçoit :

```text
X-Forwarded-Proto: https
X-Forwarded-For: $REMOTE_ADDR
Host: afd-rdc.org
```

Sans `X-Forwarded-Proto`, les redirections Auth / cookies Secure peuvent casser.

---

## 5. WebSocket (optionnel)

Pour le runtime classique Next (pas de HMR en prod), WebSocket n’est **pas obligatoire**.  
Si un module nécessite WS plus tard : activer le support WebSocket sur le context proxy (OpenLiteSpeed → Enable Websocket).

---

## 6. Ne pas cacher `/admin`, `/api`, `/auth`

Si un cache OLS / LSCache est actif :

- **Exclure** : `/admin`, `/admin/*`, `/api/*`, `/auth/*`, `/connexion`
- Ne pas activer un cache public agressif devant les pages authentifiées

---

## 7. SSL + redirection HTTP → HTTPS

CyberPanel → site `afd-rdc.org` → **SSL** → **Issue SSL** (Let’s Encrypt) pour :

- `afd-rdc.org`
- `www.afd-rdc.org` (si utilisé utilisé)

Activer **Force HTTPS**.

Politique `www` recommandée : **rediriger www → apex** (une seule URL canonique) :

```text
https://www.afd-rdc.org  →  https://afd-rdc.org
```

---

## 8. Redémarrage gracieux OpenLiteSpeed

Après modification de conf :

```bash
# Soft restart (recommandé)
sudo /usr/local/lsws/bin/lswsctrl restart

# Vérifier
sudo /usr/local/lsws/bin/lswsctrl status
curl -I https://afd-rdc.org/api/health
```

---

## 9. Vérifications

```bash
# Node local uniquement
ss -lntp | grep 3000
# Doit montrer 127.0.0.1:3000 (pas 0.0.0.0 si possible)

curl -fsS http://127.0.0.1:3000/api/health
curl -fsS https://afd-rdc.org/api/health
curl -I http://afd-rdc.org   # → 301/302 vers https
```

---

## 10. Dépannage rapide

| Symptôme | Cause probable |
|---|---|
| 502 / 503 | PM2 arrêté ou mauvais port External App |
| Cookies Auth cassés | Manque `X-Forwarded-Proto: https` |
| CSS/JS 404 | `prepare-standalone` non exécuté (`.next/static` absent) |
| Page blanche admin | Cache OLS sur `/admin` |
| Images cassées | Variables Supabase / `remotePatterns` |
