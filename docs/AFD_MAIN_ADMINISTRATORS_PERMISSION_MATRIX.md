# Matrice des permissions — Administrateurs principaux AFD

Document de référence. Les contrôles réels sont appliqués côté serveur
(`privilege-guards`, actions, RLS) et via la matrice TypeScript
`src/config/permissions.ts`.

## Rôles

| Code | Libellé | Unicité |
|------|---------|---------|
| `super_admin` | Super administrateur | 1 actif |
| `admin_principal_direction` | Administrateur principal — Direction | 1 actif |
| `admin_principal_it` | Administratrice principale — IT | 1 actif |
| `admin_module` | Administrateur de module | plusieurs |
| `responsable` | Responsable | plusieurs |
| `agent` | Agent | plusieurs |
| `agent_terrain` | Agent terrain | plusieurs |
| `auditeur` | Auditeur | plusieurs |
| `lecture_seule` | Lecture seule | plusieurs |

## Christian Sebo — `admin_principal_direction`

- Accès directionnel global (consultation des modules)
- Supervision et approbation de contenus lorsque nécessaire
- Gestion des agents (création, modification, suspension, réactivation)
- Attribution des rôles autorisés (hors `super_admin`)
- Rapports, finances (lecture), RH (lecture / employés), journaux autorisés

**Interdit :** créer / modifier / suspendre `super_admin` ; secrets ; variables d’environnement ; créer un second `super_admin` ; s’auto-attribuer un rôle critique.

## Esther Makadi — `admin_principal_it`

- Administration opérationnelle du dashboard
- Gestion utilisateurs / agents / modules / projets
- Gestion des contenus, documents, médiathèque, bibliothèque
- Paramètres fonctionnels (non secrets)
- Consultation des journaux et état système
- Révocation de sessions autorisées
- Gestion Storage autorisée

**Interdit :** `super_admin` ; secrets ; `SUPABASE_SERVICE_ROLE_KEY` ; variables d’environnement ; désactiver RLS ; supprimer définitivement les journaux ; créer un second super administrateur.

## Super Administrateur

- Tous les droits réservés
- Secrets et configuration technique
- Création / remplacement des sièges Direction et IT
- Accès de secours

## Règle d’unicité

- Un siège Direction actif
- Un siège IT actif
- Plusieurs administrateurs de modules
- Un seul `super_admin`
