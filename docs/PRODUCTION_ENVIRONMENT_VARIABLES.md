# Variables d’environnement — production VPS

Fichier réel **uniquement sur le VPS** :

```text
$VPS_APP_PATH/shared/.env.production
chmod 600 shared/.env.production
```

Modèles dans le dépôt (sans secrets) :

- `.env.example`
- `.env.production.example`

---

## Obligatoires

```env
NODE_ENV=production
HOSTNAME=127.0.0.1
PORT=3000

NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=https://afd-rdc.org
NEXT_PUBLIC_APP_NAME=Plateforme-AFD
NEXT_PUBLIC_APP_VERSION=0.1.0

NEXT_PUBLIC_SUPABASE_URL=https://mxxuxnoqnwjygawvvhcb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
# ou NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=
```

## Contact / SMTP

```env
CONTACT_NOTIFICATION_EMAIL=contactafdrdc@gmail.com
CONTACT_FROM_EMAIL=admin@afd-rdc.org
CONTACT_FROM_NAME=Site officiel AFD
CONTACT_AUTO_REPLY_ENABLED=true

MAIL_WEBMAIL_URL=
MAIL_IMAP_HOST=afd-rdc.org
MAIL_IMAP_PORT=993
MAIL_IMAP_SECURE=true
MAIL_SMTP_HOST=afd-rdc.org
MAIL_SMTP_PORT=587
MAIL_SMTP_SECURE=false
MAIL_SMTP_USERNAME=
MAIL_SMTP_PASSWORD=
MAIL_INTEGRATED_ENABLED=false
```

## OCR

```env
OCR_CLOUD_ENABLED=false
OCR_PROVIDER=native
OCR_MAX_FILE_SIZE_MB=25
OCR_MAX_PAGES=100
OCR_DEFAULT_LANGUAGE=fr
OCR_ORGANISATION_ID=afd-asbl
```

## Flags publics

```env
NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA=false
NEXT_PUBLIC_ENABLE_DEMO_CONTENT=false
NEXT_PUBLIC_NEWSLETTER_GOOGLE_OAUTH_ENABLED=true
```

---

## Interdits en `NEXT_PUBLIC_*`

- `SUPABASE_SERVICE_ROLE_KEY`
- mot de passe SMTP
- secret Google OAuth
- token / mot de passe CyberPanel
- clé SSH
- tout token d’administration

---

## Secrets GitHub Actions (Settings → Secrets)

| Secret | Usage |
|---|---|
| `VPS_HOST` | IP ou hostname SSH |
| `VPS_PORT` | Port SSH (souvent 22) |
| `VPS_USER` | Utilisateur Linux de déploiement |
| `VPS_SSH_PRIVATE_KEY` | Clé privée Actions → VPS |
| `VPS_APP_PATH` | Ex. `/home/afd-rdc.org/apps/plateforme-afd` |
| `VPS_DEPLOY_BRANCH` | `main` |
| `VPS_KNOWN_HOSTS` | (optionnel) sortie de `ssh-keyscan` |

Aucun de ces secrets ne doit apparaître dans le YAML ni dans Git.
