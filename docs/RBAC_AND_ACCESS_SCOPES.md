# RBAC et périmètres d'accès (scopes)

## Modèle RBAC

```
roles ←→ roles_permissions ←→ permissions
         ↑
utilisateurs_roles
```

- Matrice TypeScript : `src/config/permissions.ts` (indicative, complétée par SQL).
- Vérification runtime : RPC `has_permission(permission_name)`.

## Permissions IAM (`users.*`)

| Permission | Description |
|------------|-------------|
| `users.view` | Voir les utilisateurs |
| `users.invite` | Inviter |
| `users.create_admin` | Créer administrateur |
| `users.create_super_admin` | Créer super admin |
| `users.edit` | Modifier profil |
| `users.assign_roles` | Attribuer rôles |
| `users.assign_permissions` | Overrides permissions |
| `users.disable` / `users.suspend` | Désactiver / suspendre |
| `users.revoke_sessions` | Révoquer sessions |
| `users.view_security` | Vue sécurité |
| `users.view_audit` | Audit utilisateur |

## Permissions RH / Paie

Voir `permissions.ts` — préfixes `hr.*`, `payroll.*`, `hr_documents.*`.

Attribution par rôle dans la migration `20260719_050` (ex. `ressources_humaines`, `finance`).

## Périmètres d'accès (scopes)

Tables :

- `access_scopes` — définition (type + ref : `departement`, `programme`, `projet`, …)
- `user_access_scopes` — allow/deny par utilisateur
- `role_default_scopes` — scopes par défaut d'un rôle
- `user_permission_overrides` — allow/deny ponctuel sur une permission

Route admin : `/admin/acces` (permission `users.assign_permissions`).

## Navigation

Mapping sidebar → permission : `src/config/admin-nav-permissions.ts`.

## Bonnes pratiques

1. Préférer les permissions granulaires aux rôles larges pour les opérations sensibles.
2. Combiner RBAC + RLS Supabase (défense en profondeur).
3. Journaliser toute élévation via `audit_logs`.

Voir : `docs/IDENTITY_AND_ACCESS_MANAGEMENT.md`, `docs/ADMIN_RLS_PERMISSIONS.md`.
