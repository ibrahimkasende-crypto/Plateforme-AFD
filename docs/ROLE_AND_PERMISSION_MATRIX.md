# Matrice rôles et permissions AFD

| Rôle | Qui peut le créer | Qui peut le modifier | Permissions clés | Modules | Limitations | Qui peut suspendre |
|------|-------------------|----------------------|------------------|---------|-------------|-------------------|
| `super_admin` | `platform_owner` / perm. `users.create_super_admin` | Super / owner | Accès total | Tous | — | Owner / autre super (procédure) |
| `admin_principal` | Super Admin uniquement | Super Admin | users.* sauf manage_principal / create_super_admin | Admin utilisateurs | Un seul actif | Super Admin |
| `admin_module` | Admin principal | Admin principal / super | Module attribué | Modules assignés | Pas de rôles globaux | Admin principal |
| `responsable` | Admin principal | Admin principal | Périmètre projet / département | Limités | Scope | Admin principal |
| `agent` | Admin principal | Admin principal | Opérationnel limité | Assignés | Pas de finances/RH sensibles sans perm. | Admin principal |
| `agent_terrain` | Admin principal | Admin principal | Terrain / collecte | Terrain | Projets assignés | Admin principal |
| `auditeur` | Admin principal | Admin principal | Lecture + journaux autorisés | Lecture | Pas d’écriture | Admin principal |
| `lecture_seule` | Admin principal | Admin principal | Consultation | Lecture | Aucune modification | Admin principal |

## Permissions utilisateurs (extrait)

- `users.view` · `users.invite` · `users.suspend` · `users.activate`
- `users.assign_role` · `users.assign_module` · `users.assign_project`
- `users.manage_principal` — Super Admin
- `users.create_super_admin` — Super / owner

Source TypeScript : `src/config/permissions.ts`  
Source DB : migration `20260804_040_afd_user_hierarchy.sql`
