# Utilisateurs, agents et rôles

## Utilisateurs admin

Routes :

- `/admin/utilisateurs`
- `/admin/utilisateurs/nouveau`
- `/admin/utilisateurs/[id]`
- `/admin/roles`

Authentification : Supabase Auth.  
Autorisations : table `permissions` + `roles_permissions` + fonctions `has_permission` / `has_role`.  
Matrice indicative aussi dans `src/config/permissions.ts` (jamais seule source en production).

Règle : un utilisateur ne doit pas pouvoir modifier son propre rôle (à faire respecter dans les actions utilisateurs).

## Agents terrain

Routes :

- `/admin/agents`
- `/admin/agents/nouveau`
- `/admin/agents/[id]`

Table : `agents_terrain`  
Permissions : `agents:read`, `agents:write`

Champs : nom, matricule, fonction, téléphone, province, territoire, disponibilité, affectation, actif.

