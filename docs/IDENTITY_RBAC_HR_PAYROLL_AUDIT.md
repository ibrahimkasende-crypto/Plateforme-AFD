# Audit — Identité, RBAC, RH et Paie

Date : 2026-07-19  
Projet : `D:\Plateforme-AFD\AFD`  
Organisation : Alliance des Femmes pour le Développement — AFD ASBL

## Architecture actuelle

- **Auth** : Supabase Auth + gardes `requireAdmin` / `requirePermission`
- **Profils** : `profils_administrateurs` (id = auth.users)
- **RBAC** : `roles`, `permissions`, `roles_permissions`, `utilisateurs_roles` + matrice TS
- **Invitation** : `inviteUserByEmail` via `service_role` (serveur)
- **Journal** : `journal_activite` + RPC `log_admin_activity` (surtout auth)
- **RH partielle** : `membres_equipe` (vitrine), `agents_terrain`, `departements`
- **Paie** : absente

## Modules fonctionnels

| Domaine | État |
|---------|------|
| Utilisateurs / invitation | Partiel — pas de MFA, pas de protection auto-élévation |
| Rôles / permissions UI | Partiel — décalage TS↔SQL |
| Journal | Partiel — peu d’événements métier |
| Équipe publique | OK vitrine |
| Agents terrain | OK basique |
| Contrats / présences / congés / paie | Absents |

## Risques d’escalade

1. Attribution possible de `super_admin` sans garde MFA / owner  
2. Self-UPDATE profil trop large (RLS)  
3. Policies 030 trop permissives sur certaines tables  
4. Pas d’interdiction de modifier son propre rôle  
5. MFA affichée mais non imposée sur actions privilégiées  

## Plan d’implémentation

1. Migration non destructive identité étendue + RBAC + scopes + RH + paie  
2. Permissions granulaires `users.*` / `hr.*` / `payroll.*`  
3. Sécurisation invitations + super_admin + platform_owner  
4. Profils / avatars privés  
5. Journal append-only enrichi  
6. Modules RH opérationnels  
7. Moteur de paie à règles versionnées (démo non officielle)  
8. Portail employé limité  
9. Seeds `is_demo` + tests + docs  

**Principe** : aucune auto-promotion ; mots de passe jamais définis par un admin tiers ; paie clôturée immuable ; règles légales versionnées et validables.

