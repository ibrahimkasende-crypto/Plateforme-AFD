# Variables d’environnement Hostinger

Documenter **sans révéler les valeurs**. Ne jamais préfixer une clé privée avec `NEXT_PUBLIC_`.

## Publiques (client)

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_APP_ENV` | `production` |
| `NEXT_PUBLIC_SITE_URL` | `https://afd-rdc.org` |
| `NEXT_PUBLIC_SUPABASE_URL` | URL projet Supabase production |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clé publishable (anon) |

## Serveur

| Variable | Rôle |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (serveur uniquement) |
| `DATABASE_URL` | Connexion Postgres si utilisée par scripts/outil |

## Feature flags

```
NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA=false
NEXT_PUBLIC_ENABLE_WATER_RIPPLE=true
NEXT_PUBLIC_ENABLE_SECTION_ANIMATIONS=true
NEXT_PUBLIC_ENABLE_MOBILE_RAILS=true
```

## Intégrations (désactivées par défaut en prod initiale)

```
NEWSLETTER_SEND_ENABLED=false
SERDIPAY_ENABLED=false
OCR_CLOUD_ENABLED=false
```

## Interdit de versionner

`.env`, `.env.local`, `.env.production`, `*.pem`, `*.key`, `credentials.json`, `service-account*.json`
