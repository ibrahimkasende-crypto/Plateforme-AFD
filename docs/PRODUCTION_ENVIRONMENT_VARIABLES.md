# Variables d’environnement — production VPS

Fichier réel **uniquement sur le VPS** :

```text
/home/afd-rdc.org/apps/plateforme-afd/shared/.env.production
chmod 600
chown afdrd7787:afdrd7787
```

Création assistée :

```bash
sudo bash /home/afd-rdc.org/apps/plateforme-afd/repo/scripts/setup-production-env.sh
```

Modèles dans le dépôt (sans secrets) :

- `.env.example`
- `.env.production.example`

Chaque release reçoit un **lien symbolique** vers ce fichier (jamais une copie permanente des secrets).

---

## Runtime Node

```env
NODE_ENV=production
HOSTNAME=127.0.0.1
PORT=3000
```

## App / site

```env
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=https://afd-rdc.org
NEXT_PUBLIC_APP_NAME=Plateforme-AFD
NEXT_PUBLIC_APP_VERSION=0.1.0
```

## Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
# ou NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=
```

Auth Supabase (console) :

- Site URL : `https://afd-rdc.org`
- Redirect URLs :
  - `https://afd-rdc.org/auth/callback`
  - `https://afd-rdc.org/**`
  - `https://www.afd-rdc.org/auth/callback` (si www)
  - `http://localhost:3000/auth/callback` (dev)

## Feature flags

```env
NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA=false
NEXT_PUBLIC_ENABLE_DEMO_CONTENT=false
NEXT_PUBLIC_ENABLE_SPONTANEOUS_APPLICATIONS=false
NEXT_PUBLIC_ENABLE_WATER_RIPPLE=true
NEXT_PUBLIC_ENABLE_SECTION_ANIMATIONS=true
NEXT_PUBLIC_ENABLE_MOBILE_RAILS=true
NEXT_PUBLIC_NEWSLETTER_GOOGLE_OAUTH_ENABLED=true
```

## Contact / SMTP

```env
CONTACT_NOTIFICATION_ENABLED=true
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
MAIL_SMTP_USERNAME=admin@afd-rdc.org
MAIL_SMTP_PASSWORD=
MAIL_INTEGRATED_ENABLED=false
```

Test local/VPS (avec env chargé) :

```bash
npm run email:test-contact
```

## Newsletter / Paiement carte / OCR

```env
NEWSLETTER_SEND_ENABLED=false
CARD_PAYMENT_ENABLED=false

OCR_CLOUD_ENABLED=false
OCR_PROVIDER=native
OCR_MAX_FILE_SIZE_MB=25
OCR_MAX_PAGES=100
OCR_DEFAULT_LANGUAGE=fr
OCR_ORGANISATION_ID=afd-asbl
```

> SerdiPay n’est pas utilisé par Plateforme-AFD (projet Campus Food distinct).

---

## Interdits en `NEXT_PUBLIC_*`

- `SUPABASE_SERVICE_ROLE_KEY`
- mot de passe SMTP
- secret Google
- clé privée SSH
- secret CyberPanel
- token GitHub

## Interdits dans Git / docs / logs / YAML

Toute vraie valeur secrète. Utiliser uniquement des placeholders.
