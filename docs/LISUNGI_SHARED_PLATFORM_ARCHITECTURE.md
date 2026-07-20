# Architecture partagée — Web / Desktop / Mobile

## Principe

LISUNGI Web, Desktop et Mobile partagent :

- Supabase Auth
- Base de données Postgres + RLS
- Storage fichiers
- Règles métier (services / packages partagés)
- Rôles & permissions
- Workflows
- Notifications
- Journalisation
- API (Supabase + éventuelles Edge Functions)

Le code métier ne doit **pas** être recopié séparément dans chaque interface sans stratégie commune (monorepo / packages partagés).

## Couches recommandées

```
packages/domain      → types, règles, validations Zod
packages/data        → clients Supabase, repositories
packages/auth        → session, rôles, memberships
apps/web             → Next.js (actuel)
apps/desktop         → futur (Electron / Tauri)
apps/mobile          → futur (Flutter / React Native)
```

## Synchronisation

- Online-first (Web)
- Desktop / Mobile : file d’attente locale + sync conflictuelle guidée
- Même `organization_id` et mêmes politiques RLS

## Notifications

Canal unique côté serveur ; delivery adapters (web push, mobile push, email).
