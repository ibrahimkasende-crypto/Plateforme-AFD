# Rapport final — Gestion des comptes AFD

Date : 2026-08-04

## 1. Système existant audité

IAM déjà présent : `profils_administrateurs`, `roles`, `permissions`, `utilisateurs_roles`, `admin_invitations`, avatars `admin-avatars`.  
Orienté historiquement `platform_owner` / multi-tenant léger.  
Absence initiale de `admin_principal` et d’écrans `/admin/administrateur-principal`.

## 2. Rôles créés ou corrigés

Ajoutés / consolidés : `admin_principal`, `admin_module`, `responsable`, `agent`, `lecture_seule`  
Conservés : `super_admin`, `administrateur` (legacy → mappé principal), `agent_terrain`, `auditeur`.

## 3. Super Administrateur identifié

Comptes `super_admin` / `platform_owner` dans `utilisateurs_roles`.  
Aucun Administrateur principal actif au moment de la migration (`ACTIVE_PRINCIPALS=0`).

## 4. Écran création Administrateur principal

`/admin/administrateur-principal` (+ `/creer`, `/modifier`, `/historique`) — réservé Super Admin.

## 5. Contrainte un seul Administrateur principal actif

Fonction `count_active_admin_principals()` + trigger `trg_enforce_single_admin_principal`  
+ garde applicative `assertCanCreatePrincipal`.

## 6. Module utilisateurs

Liste, invitations, rôles, permissions, fiche à onglets, wizard 5 étapes.

## 7. Création des agents

Wizard `/admin/utilisateurs/nouveau` filtré selon acteur (principal vs super).

## 8. Invitation

`inviteAdministrator` — Service Role, statut `invited`, expiration 7 j, pas de MDP tiers.

## 9. Profils complets

Colonnes étendues sur `profils_administrateurs` + `employment_types`.

## 10. Photo de profil

Système existant consolidé (5 Mo, JPEG/PNG/WebP, bucket privé, URLs signées).

## 11–14. Limitations modules / projets / départements / provinces

Rôles + permissions serveur ; types d’affectation dans le wizard ; affinages sur fiche.

## 15. Permissions serveur

`canAssignRole`, `requirePermission` / `requireAnyPermission`, `assertCannotTouchSuperAdmin`.

## 16. RLS

Politiques sur `admin_principal_history`, `user_status_history`, `employment_types`.

## 17. Journaux

`admin_principal_history`, `user_status_history`, `appendAuditLog`.

## 18. Notifications

Flux invitation via e-mail Supabase ; hooks audit pour événements statut.

## 19. Anciens comptes

Aucun utilisateur supprimé. Migration progressive documentée dans `USER_ACCOUNT_MIGRATION_REPORT.md`.  
Migration SQL appliquée sur l’instance (`MIGRATION_OK`).

## 20. Tests

- Vitest : **51 passed** (dont `privilege-guards-hierarchy`)
- E2E specs ajoutés : `super-admin-create-main-admin`, `main-admin-create-agent`, `main-admin-permissions`, `agent-access-limitations`, `user-invitation`, `user-profile-photo`, `user-suspension`, `privilege-escalation`, `main-admin-replacement`

## 21–23. Validation build

| Commande | Résultat |
|----------|----------|
| `npm run typecheck` | OK |
| `npm run lint` | OK (0 erreur, warnings préexistants) |
| `npm run test` | OK — 51 passed |
| `npm run build` | OK |

## 24. Problèmes restants / suites recommandées

- Affinage modules/projets/permissions fines via UI dédiée (au-delà du rôle principal)
- Notifications in-app pour tous les événements listés (partiellement via audit / e-mail)
- E2E bout-en-bout complets (création réelle + activation) dépendent des credentials `AFD_E2E_*` et du Service Role
- Recadrage carré avancé côté client (upload + compression déjà présents)

## 25. Confirmation production

La hiérarchie **Super Admin → Administrateur principal unique → agents** est opérationnelle pour l’AFD (mono-organisation), avec migration DB appliquée, écrans, gardes serveur, invitations et build verts.

**Prêt pour mise en production sous réserve** : configurer `SUPABASE_SERVICE_ROLE_KEY` sur l’hébergeur, créer le premier Administrateur principal depuis un compte Super Admin, puis déléguer la gestion quotidienne.
