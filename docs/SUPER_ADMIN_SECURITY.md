# Sécurité super administrateur

## Rôles très privilégiés

| Rôle | Niveau | Particularités |
|------|--------|----------------|
| `platform_owner` | 1000 | Un seul bootstrap initial ; création d'autres owners réservée aux owners |
| `super_admin` | 900 | MFA obligatoire ; permission `users.create_super_admin` ou owner |

Implémentation : `src/features/identity/security/privilege-guards.ts`.

## Garde-fous

### Invitation (`inviteAdministrator`)

- Vérification `canAssignRole()` selon rôle acteur et permissions.
- MFA `aal2` exigée pour `super_admin` et `platform_owner`.
- Raison obligatoire pour `platform_owner`.
- Flag `doit_configurer_mfa` sur le profil invité.

### Changement de rôle (`updateUserRoleSecure`)

- Interdiction de modifier son propre rôle.
- MFA pour élévation vers rôles privilégiés.
- Blocage rétrogradation du **dernier** `platform_owner` actif (`count_active_platform_owners`).

### UI

- `/admin/utilisateurs/nouveau?type=super_admin` — avertissement MFA + champ raison requis.
- Rôle `platform_owner` masqué sauf pour un owner connecté.

## Flux d'approbation (tables)

- `privileged_access_requests` — demandes d'accès élevé avec justification.
- `privileged_access_approvals` — décisions multi-approbateurs (MFA enregistrée).

## Recommandations opérationnelles

1. Limiter `super_admin` à 2–3 personnes maximum.
2. Activer MFA Supabase pour tous les comptes admin.
3. Auditer `audit_logs` (`action` commençant par `users.`) mensuellement.
4. Ne jamais committer `SUPABASE_SERVICE_ROLE_KEY`.

Voir : `docs/CREATE_FIRST_SUPER_ADMIN.md`, `scripts/bootstrap-platform-owner.ts`.

