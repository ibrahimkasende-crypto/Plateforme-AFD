# Règles de sécurité des comptes AFD

1. **Pas d’auto-promotion** — `assertNotSelfRoleChange`
2. **Pas de suspension du super_admin** par un admin principal — `assertCannotTouchSuperAdmin`
3. **Un seul admin_principal actif** — trigger SQL + `assertCanCreatePrincipal`
4. **Permissions vérifiées serveur** — `requirePermission` / `canAssignRole`
5. **Service Role serveur uniquement** — `SUPABASE_SERVICE_ROLE_KEY`
6. **Invitation sans mot de passe tiers**
7. **Suspension → révocation sessions** — `auth.admin.signOut`
8. **Pas de suppression physique immédiate** — suspend / archive
9. **MFA** recommandée / obligatoire pour rôles privilégiés
10. **Avatars privés** + URLs signées
11. **Audit** sur invite, suspend, rôle, principal
12. **RLS** sur tables identity / history

Voir aussi : `docs/USER_MANAGEMENT_ARCHITECTURE.md`
