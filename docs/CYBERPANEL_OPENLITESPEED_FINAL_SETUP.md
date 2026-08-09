# OpenLiteSpeed — configuration finale (CyberPanel)

Cible :

```text
https://afd-rdc.org  →  http://127.0.0.1:3000
```

Prérequis : `curl -fsS http://127.0.0.1:3000/api/health` répond `"status":"ok"`.

Ne pas servir Next.js depuis `public_html`.  
Ne pas modifier MX / SPF / DKIM / DMARC / comptes email.

---

## Dans CyberPanel

1. **Websites** → `afd-rdc.org` → **Manage**
2. **SSL** → Let’s Encrypt pour `afd-rdc.org` (+ `www` si utilisé) → **Force HTTPS**

## OpenLiteSpeed WebAdmin (ou vhost conf)

### External App

| Champ | Valeur |
|---|---|
| Name | `plateforme-afd` |
| Type | Web Server / Proxy |
| Address | `127.0.0.1:3000` |
| Max Connections | `100` |
| Initial Request Timeout | `60` |
| Retry Timeout | `0` |
| Response Buffering | No |

### Context Proxy

| Champ | Valeur |
|---|---|
| URI | `/` |
| External App | `plateforme-afd` |
| Accessible | Yes |

### Headers

Préserver / transmettre :

- `Host`
- `X-Forwarded-For`
- `X-Forwarded-Proto` = `https`

### Virtual host / Listener

- VHost : `afd-rdc.org`
- Listener HTTPS actif
- Redirection HTTP → HTTPS

### Cache

Ne pas cacher publiquement :

- `/admin`, `/api`, `/auth`, `/connexion`
- callbacks OAuth, pages session

Cache prudent éventuel : `/_next/static/*` uniquement.

### Redémarrage

```bash
sudo /usr/local/lsws/bin/lswsctrl restart
curl -fsS https://afd-rdc.org/api/health
```

Attendu : JSON `"status":"ok"`.
