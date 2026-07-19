# RBAC — Plateforme-AFD

## Source unique
- SQL : `roles`, `permissions`, `roles_permissions`, `utilisateurs_roles`
- TS : `src/config/roles.ts`, `src/config/permissions.ts`
- Helpers : `hasPermission`, `requirePermission`, `src/lib/auth/guards.ts`
- RPC : `has_permission`, `has_role`, `is_active_admin`

## Règles
- Ne jamais faire confiance au rôle navigateur
- `platform_owner` / `super_admin` : accès étendu, MFA pour actions critiques
- Pas d’auto-promotion / pas de self-role change
