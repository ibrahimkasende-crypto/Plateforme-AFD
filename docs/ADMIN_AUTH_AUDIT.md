# Audit — Authentification administrateur Plateforme-AFD

Date : 2026-07-17  
Projet : `D:\Plateforme-AFD\AFD`

## 1. Authentification existante

- Clients : `src/lib/supabase/client.ts`, `server.ts`, `safe.ts`
- Middleware : rafraîchit la session uniquement — **aucune protection `/admin`**
- `getAdminViewer()` : stub (rôle élevé en dev sans login)
- Pas de pages `/connexion`, callback, reset password
- Déconnexion dashboard : no-op

## 2. Tables utilisées

| Table | État |
|---|---|
| `administrateurs` | Legacy (`email`, `est_admin`) — dans types TS |
| `profils_administrateurs` | Migration `20260715_001` — **hors types TS** |
| `roles`, `permissions`, `roles_permissions`, `utilisateurs_roles` | Migration présente — hors types TS |
| `journal_activite` | Non créée |

Fonctions SQL : `is_active_admin()`, `has_role()`, `has_permission()`.

## 3. Protection actuelle des routes

**Aucune.** Layout admin charge le shell sans `requireAdmin`. Middleware ne redirige pas.

## 4. Rôles disponibles

- App : 13 rôles dans `src/config/roles.ts` + matrice `permissions.ts`
- SQL seed : `super_admin`, `administrateur`, `editeur`, `communication`, `suivi_evaluation`, `finance_lecture` (écart à combler)

## 5. Failles identifiées

1. `/admin` public
2. Bypass rôle en développement
3. Permissions TS non branchées sur Supabase
4. Types TS incomplets pour RBAC
5. Pas de journalisation auth
6. Server actions dashboard sans garde

## 6. Éléments à corriger

- Routes auth + actions signIn/signOut/reset
- `requireAdmin` / `requirePermission` serveur
- Middleware garde `/admin`
- Migration rôles app + journal
- Sidebar filtrée + layout protégé
- Docs super admin + tests e2e

