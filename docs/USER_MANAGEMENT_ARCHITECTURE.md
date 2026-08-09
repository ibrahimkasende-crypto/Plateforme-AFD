# Architecture — Gestion des comptes AFD

## Périmètre

Organisation unique : **Alliance des Femmes pour le Développement (AFD ASBL)**.  
Pas de multi-tenant / sélecteur d’organisation dans ce module.

## Hiérarchie

```
Super Administrateur (super_admin / platform_owner)
        ↓ crée une seule fois
Administrateur principal (admin_principal)
        ↓ crée au quotidien
admin_module · responsable · agent · agent_terrain · auditeur · lecture_seule
```

## Flux de création

1. Super Admin → `/admin/administrateur-principal/creer` → invitation `admin_principal`
2. Contrainte DB : **un seul** Administrateur principal actif (`enforce_single_admin_principal`)
3. Admin principal → `/admin/utilisateurs/nouveau` → wizard 5 étapes → invitation

Aucun mot de passe n’est défini par un tiers. Statut initial : `invited`.

## Couches

| Couche | Emplacement |
|--------|-------------|
| Config rôles / types agents | `src/config/roles.ts`, `src/config/afd-staff.ts` |
| Permissions | `src/config/permissions.ts` |
| Gardes | `src/features/identity/security/privilege-guards.ts` |
| Invitation | `src/features/identity/services/invitation.service.ts` |
| Admin principal | `src/features/identity/services/principal-admin.service.ts` |
| Migration | `supabase/migrations/20260804_040_afd_user_hierarchy.sql` |
| Avatars | bucket `admin-avatars`, `src/features/identity/actions/avatar.ts` |

## Tables clés

- `profils_administrateurs` — profils étendus
- `roles` / `permissions` / `roles_permissions` / `utilisateurs_roles`
- `admin_invitations`
- `admin_principal_history`
- `user_status_history`
- `employment_types`

## Sécurité

- Vérifications **côté serveur** (`canAssignRole`, `requirePermission`, RLS)
- Service Role uniquement via `SUPABASE_SERVICE_ROLE_KEY` (jamais `NEXT_PUBLIC_*`)
- Suspension → `auth.admin.signOut`
- Interdit : auto-promotion, création de `super_admin` par l’admin principal
