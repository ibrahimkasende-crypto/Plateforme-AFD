# Plateforme-ADF

Plateforme web institutionnelle de l’Alliance des Femmes pour le Développement (AFD), permettant de présenter ses actions, programmes et actualités, avec un espace d’administration sécurisé pour gérer les contenus.

Projet reconstruit avec **Next.js (App Router)** — architecture alignée pour le développement progressif des modules.

## Démarrage

```bash
cd AFD
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build de production
- `npm run start` — démarrer le build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript

## Documentation

- `docs/ARCHITECTURE_ALIGNED_V2.md`
- `docs/ALIGNEMENT_ARCHITECTURE_AUDIT.md`
- `docs/SUPABASE_TARGET_SCHEMA.md`
- `docs/SERDIPAY_INTEGRATION_REQUIREMENTS.md`

Configurer les variables dans `.env.local` à partir de `.env.example`.
