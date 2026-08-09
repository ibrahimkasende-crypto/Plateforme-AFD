# Architecture déploiement — GitHub → VPS CyberPanel

```text
Cursor (local Windows)
    │  git push origin main
    ▼
GitHub (dépôt privé)
    │  GitHub Actions (validate + build)
    ▼
SSH (clé dédiée)
    ▼
VPS Linux + CyberPanel / OpenLiteSpeed
    │  scripts/deploy-production.sh <sha>
    ▼
releases/<stamp>  (build hors ligne)
    │  symlink atomique
    ▼
current → release active
    │
    ▼
PM2 (plateforme-afd) → 127.0.0.1:3000
    │
    ▼
OpenLiteSpeed reverse proxy
    │
    ▼
https://afd-rdc.org
    │
    ▼
Supabase (Postgres / Auth / Storage)
```

## Structure VPS

```text
/home/afd-rdc.org/apps/plateforme-afd/     # VPS_APP_PATH (à confirmer)
├── ecosystem.config.cjs
├── current -> releases/20260809-113000
├── repo/                     # clone git (Deploy Key lecture seule)
├── shared/
│   ├── .env.production       # chmod 600
│   └── logs/
└── releases/
    ├── 20260809-101500/
    └── 20260809-113000/
```

Persistants uniquement dans `shared/` (+ Supabase).  
Les releases sont jetables.

## Fichiers clés du dépôt

| Fichier | Rôle |
|---|---|
| `next.config.ts` | `output: "standalone"` |
| `ecosystem.config.cjs` | PM2 |
| `scripts/prepare-standalone.mjs` | copie public + static |
| `scripts/deploy-production.sh` | release + switch + health + rollback auto |
| `scripts/rollback-production.sh` | rollback manuel |
| `.github/workflows/deploy-production.yml` | CI/CD |
| `/api/health` | health non sensible |

## Flux zero-downtime (faible interruption)

1. Build dans une **nouvelle** release (l’ancienne reste servie)
2. Smoke test sur port temporaire
3. `ln -sfn` atomique de `current`
4. `pm2 startOrReload`
5. Health local + public
6. Rollback automatique si échec

## Plus de ZIP

Le workflow Hostinger ZIP (`Deploy/`, `npm run deploy:zip`) n’est plus le chemin officiel.
