# Identité et gestion des accès (IAM)

## Vue d'ensemble

Le module IAM repose sur **Supabase Auth** pour l'authentification et une couche applicative pour l'autorisation :

| Couche | Rôle |
|--------|------|
| `auth.users` | Identité, MFA, sessions |
| `profils_administrateurs` | Profil métier admin (statut, avatar, employé lié) |
| `roles` / `permissions` / `utilisateurs_roles` | RBAC |
| `user_access_scopes` | Périmètres d'accès (programme, département, etc.) |
| `admin_invitations` | Traçabilité des invitations |
| `audit_logs` | Journal append-only |

Migration de référence : `supabase/migrations/20260719_050_identity_hr_payroll.sql`.

## Gardes serveur

- `requireAdmin()` — accès administration (profil actif + rôle)
- `requirePermission(permission)` — permission granulaire `users.*`, `hr.*`, `payroll.*`
- `hasPermission(userId, permission)` — RPC `has_permission` + fallback matrice TS

## Actions sensibles

| Action | Fichier | Permission |
|--------|---------|------------|
| Inviter | `invite-user.ts` → `invitation.service.ts` | `users.invite` |
| Modifier rôle | `manage-utilisateur.ts` → `updateUserRoleSecure` | `users.assign_roles` |
| Désactiver | `manage-utilisateur.ts` | `users.disable` ou `users.suspend` |
| Avatar | `avatar.ts` | `users.edit` |

## Principes

1. **Aucun mot de passe tiers** — invitation par e-mail uniquement (`inviteUserByEmail`).
2. **Pas d'auto-élévation** — `assertNotSelfRoleChange`, `assertNotSelfAccountDeletion`.
3. **MFA (aal2)** requise pour `super_admin` / `platform_owner` (invitation et changement de rôle).
4. **Dernier owner protégé** — RPC `count_active_platform_owners`.

## Bootstrap initial

Script one-shot : `scripts/bootstrap-platform-owner.ts` (variable `PLATFORM_OWNER_EMAIL`).

Voir aussi : `docs/SUPER_ADMIN_SECURITY.md`, `docs/ADMIN_INVITATION_WORKFLOW.md`, `docs/RBAC_AND_ACCESS_SCOPES.md`.
