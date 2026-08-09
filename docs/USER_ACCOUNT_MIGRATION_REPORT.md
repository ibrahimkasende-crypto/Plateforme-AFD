# Rapport de migration des comptes existants

## Objectif

Conserver tous les comptes existants, rattacher les rôles legacy, identifier le Super Administrateur, sans multi-organisation.

## Stratégie (progressive)

1. **Ne supprimer aucun utilisateur Auth / profil**
2. Migration `20260804_040_afd_user_hierarchy.sql` :
   - Ajoute rôles `admin_principal`, `admin_module`, `responsable`, `agent`, `lecture_seule`
   - Conserve `administrateur` (legacy mappé vers principal dans l’app)
   - Étend colonnes `profils_administrateurs`
   - Crée `employment_types`, `admin_principal_history`, `user_status_history`
   - Contrainte unicité principal actif
3. Mapping applicatif : `mapLegacyRole('administrateur') → admin_principal`
4. Statuts : profils actifs → `active` ; invités → `invited` ; `actif=false` → `suspended`/`disabled`

## Identification Super Admin

Les comptes portant `super_admin` ou `platform_owner` dans `utilisateurs_roles` restent Super Administrateurs.

## Identification Administrateur principal

- S’il existe déjà un `administrateur` / `admin_principal` actif → considéré comme principal
- Sinon le Super Admin crée le premier via `/admin/administrateur-principal/creer`

## Doublons

- E-mail unique Auth
- Index unique `matricule` (si renseigné)

## À faire après déploiement SQL

1. Appliquer la migration sur le projet Supabase mandaté
2. Vérifier `count_active_admin_principals()`
3. Compléter les profils incomplets (nom, téléphone, photo)
4. Révoquer invitations expirées obsolètes

## Statut

Migration SQL **livrée** dans le dépôt. Application sur l’instance distante à confirmer lors du déploiement.
