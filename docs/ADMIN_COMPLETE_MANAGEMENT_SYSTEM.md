# Système de gestion administratif complet

## Objectif
Tous les modules `/admin` sont opérationnels, connectés à Supabase, sans placeholder « en préparation ».

## Architecture
- Pages RSC + `requirePermission`
- Queries `src/lib/queries/admin/*`
- Server Actions `src/features/*/actions/manage-*.ts`
- Composants partagés `src/components/admin/{data,forms,actions,module}/`
- Migration modules : `20260719_030_admin_missing_modules.sql`

## Paramètres
Accessible via icône Settings du header (`parametres:manage`) → `/admin/parametres` (onglets).

## Seeds
```bash
CONFIRM=yes npm run seed:presentation
CONFIRM=yes npm run seed:complete-admin
```

