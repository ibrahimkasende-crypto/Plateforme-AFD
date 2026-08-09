# Workflow d'invitation administrateur

## Parcours utilisateur

1. Un admin avec `users.invite` ouvre `/admin/utilisateurs/nouveau`.
2. Formulaire en 6 étapes (Identity → Fonction → Type → Rôle → Sécurité → Confirmation).
3. Soumission → `inviteUserAction` → `inviteAdministrator`.
4. E-mail Supabase Auth avec lien vers `/auth/callback?next=/nouveau-mot-de-passe`.
5. L'invité définit **son propre** mot de passe.
6. Entrée enregistrée dans `admin_invitations` (statut `pending` → `accepted`).

## Prérequis serveur

```env
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=https://...
```

Sans `SUPABASE_SERVICE_ROLE_KEY`, l'invitation est indisponible (`getInviteAvailable()`).

## Permissions par rôle cible

| Rôle cible | Permission / condition |
|------------|------------------------|
| Rôles standard | `users.invite` |
| `administrateur` | `users.create_admin` ou super_admin / owner |
| `super_admin` | `users.create_super_admin` ou owner + MFA + raison |
| `platform_owner` | Owner uniquement + MFA + raison obligatoire |

## Données créées

1. Utilisateur Auth (invitation)
2. Ligne `profils_administrateurs` (`statut_compte = invited`)
3. Ligne `utilisateurs_roles`
4. Ligne `admin_invitations`
5. Entrée `audit_logs` (`users.invite`)

## Nettoyage en cas d'échec

Si le profil ou le rôle échoue après création Auth, `invitation.service.ts` tente `deleteUser` pour éviter les comptes orphelins.

## Pages associées

- `/admin/invitations` — suivi des invitations
- `/admin/utilisateurs` — liste des comptes

Fichiers : `src/features/identity/actions/invite-user.ts`, `src/features/identity/services/invitation.service.ts`.

