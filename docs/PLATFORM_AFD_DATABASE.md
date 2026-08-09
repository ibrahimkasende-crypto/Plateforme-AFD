# Base de données — Plateforme-AFD

Voir `docs/DATABASE_CHANGELOG.md` pour l’historique.

Migrations clés :
- `20260715_001` — fondations sécurité
- `20260718_005` — rôles/permissions/journal
- `20260719_030` — modules admin (RLS initialement permissive)
- `20260719_040/041` — OCR
- `20260719_050` — IAM/RH/paie
- `20260719_051` — fondations sécurisées + stocks/logistique

Régénération types :
```bash
npx supabase gen types typescript --linked > src/types/database.types.ts
```

