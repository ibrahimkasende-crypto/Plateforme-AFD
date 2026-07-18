# RLS et permissions — état

## Principes

- RLS activé sur les tables exposées
- Public : lecture des contenus publiés uniquement
- Insert public limité aux formulaires / réponses d’enquêtes publiques
- Admin : `has_permission(...)` ou `has_role('super_admin')`
- Pas de `USING (true)` sur données privées

## Nouvelles permissions (migration 011)

- `enquetes:read` / `enquetes:write`
- `agents:read` / `agents:write`
- `pages:write`
- `temoignages:write`
- `appels-offres:read` / `appels-offres:write`
- `histoires:read` / `histoires:write`
- alignement `opportunites:*`, `documents:*`, `candidatures:*`

## Côté application

`src/config/permissions.ts` + `requirePermission()` sur les pages admin.

Les rôles navigateur seuls ne suffisent jamais : contrôle serveur + RLS.
