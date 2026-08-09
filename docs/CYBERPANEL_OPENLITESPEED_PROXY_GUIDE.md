# OpenLiteSpeed / CyberPanel — reverse proxy Next.js

Domaine : **https://afd-rdc.org**  
Backend : **http://127.0.0.1:3000**  
Panneau : **https://panel.afd-rdc.org:8090**  
User site : **afdrd7787** — home `/home/afd-rdc.org`

> Next.js n’est **pas** un site PHP dans `public_html`.

---

## Prérequis

```bash
curl -I http://127.0.0.1:3000/api/health
pm2 status plateforme-afd
ss -lntp | grep 3000   # doit écouter 127.0.0.1
```

---

## 1. External App (OpenLiteSpeed)

Via OLS WebAdmin ou configuration vhost `afd-rdc.org` :

| Champ | Valeur |
|---|---|
| Name | `plateforme-afd` |
| Type | Web Server / Proxy |
| Address | `127.0.0.1:3000` |
| Max Connections | `100` |
| Initial Request Timeout | `60` |
| Retry Timeout | `0` |
| Response Buffering | No |

---

## 2. Proxy Context

| Champ | Valeur |
|---|---|
| URI | `/` |
| External App | `plateforme-afd` |
| Accessible | Yes |

---

## 3. Headers à transmettre

- `Host`
- `X-Forwarded-For`
- `X-Forwarded-Proto: https`

Sans `X-Forwarded-Proto`, Auth/cookies Secure peuvent échouer.

---

## 4. WebSocket

Non obligatoire pour Next en production (pas de HMR).  
Activer seulement si un besoin futur l’exige.

---

## 5. Cache (prudence)

**Ne pas** mettre en cache public agressif :

- `/admin`, `/admin/*`
- `/api/*`
- `/auth/*`
- `/connexion`
- `/mot-de-passe-oublie`
- pages dashboard / sessions / formulaires / OAuth callbacks

Cache prudent éventuel uniquement pour :

- assets `/_next/static/*`
- images statiques publiques

---

## 6. SSL + HTTPS

CyberPanel → SSL → Let’s Encrypt :

- `afd-rdc.org`
- `www.afd-rdc.org` (si utilisé)

Force HTTPS. Politique recommandée : **www → apex**.

Listener HTTPS du vhost pointe vers le site `afd-rdc.org`.

---

## 7. Redémarrage gracieux

```bash
sudo /usr/local/lsws/bin/lswsctrl restart
curl -I https://afd-rdc.org/api/health
curl -fsS https://afd-rdc.org/api/health
```

---

## 8. Ne pas toucher

- Config email CyberPanel
- MX / SPF / DKIM / DMARC
- Boîtes mail existantes
