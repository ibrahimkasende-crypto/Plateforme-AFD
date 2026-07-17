# Implémentation — Authentification admin AFD

Date : 2026-07-17

## 1. Système d’authentification

- Supabase Auth (email / mot de passe) via `@supabase/ssr`
- Clients : `src/lib/supabase/client.ts`, `server.ts`, `safe.ts`
- Middleware : rafraîchissement session + garde `/admin` sans utilisateur
- Actions : `src/actions/auth.ts` (`signIn`, `signOut`, `requestPasswordReset`, `updatePassword`)

## 2. Routes protégées / auth

| Route | Rôle |
|---|---|
| `/connexion` | Connexion admin |
| `/mot-de-passe-oublie` | Demande reset |
| `/nouveau-mot-de-passe` | Nouveau mot de passe |
| `/auth/callback` | Exchange code session |
| `/acces-refuse` | Refus profil / désactivé / rôle |
| `/admin/*` | `requireAdmin()` dans layout + middleware |

## 3–4. Rôles et permissions

- 13 rôles `src/config/roles.ts`
- Matrice `src/config/permissions.ts`
- Seed SQL migration `20260718_005_admin_auth_roles_journal.sql`
- Sidebar filtrée via `admin-nav-permissions.ts`

## 5. Fonctions serveur

- `get-current-user.ts`
- `require-auth.ts`
- `require-admin.ts`
- `require-permission.ts`
- `get-user-role.ts`
- `has-permission.ts`
- `log-admin-activity.ts`

## 6–7. Tables et RLS

- `profils_administrateurs` (source de vérité profil)
- `roles`, `permissions`, `roles_permissions`, `utilisateurs_roles`
- `journal_activite` (nouvelle)
- Fonctions SQL : `is_active_admin`, `has_role`, `has_permission`, `log_admin_activity`
- Policy update `derniere_connexion` pour le titulaire

## 8. Super admin

Voir `docs/CREATE_FIRST_SUPER_ADMIN.md`.

## 9. Récupération mot de passe

1. `/mot-de-passe-oublie` → `resetPasswordForEmail`
2. Redirect `/auth/callback?next=/nouveau-mot-de-passe`
3. `/nouveau-mot-de-passe` → `updatePassword`
4. Retour `/connexion`

Redirect URLs Supabase : `{NEXT_PUBLIC_SITE_URL}/auth/callback`

## 10. Journalisation

Événements : login success/denied, logout, reset, password updated, compte désactivé, rôle manquant.  
Jamais de mot de passe / token.

## 11. Tests

- `tests/e2e/admin-auth.spec.ts`
- `tests/e2e/admin-route-protection.spec.ts`
- `tests/e2e/admin-permissions.spec.ts`

## 12–14. Validation

- `npm run typecheck` : OK
- `npm run lint` : OK (1 warning RHF public existant)
- `npm run build` : OK
- e2e auth / protection / permissions : 9 passed, 1 skipped (credentials e2e absents)

## 15. Prochaine étape

Modules CRUD admin (programmes, projets, …) derrière `requirePermission`.
