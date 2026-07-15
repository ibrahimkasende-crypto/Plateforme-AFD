# Refonte V2 — Phase 3 : administration et pilotage

## Pages administratives modernisées

- `/admin` et `/admin/dashboard` : nouveau tableau de bord avec indicateurs réels accessibles.
- Toutes les pages existantes utilisant `LayoutAdmin` bénéficient désormais de `src/layouts/AdminLayout.tsx`.
- Routes préparées : équipe, clusters, médiathèque, messages, adhésions, intentions de dons, statistiques et rapports.

Les routes préparées affichent volontairement un état professionnel sans données de démonstration tant que le schéma et les politiques nécessaires ne sont pas validés.

## Composants créés

- `AdminLayout` : sidebar responsive, menu mobile, réduction de navigation, en-tête, profil administrateur, déconnexion et fil d’Ariane.
- `StatCard`, `ChartCard`, `DataQualityWarning`.
- `AdminModulePlaceholder` : interface de module non activé sans inventer de données.

## Graphiques ajoutés

- Répartition réelle des projets par statut.
- Nombre de projets par programme disponible.

Les graphiques sont des barres accessibles avec tableau alternatif. Aucune bibliothèque supplémentaire n’a été ajoutée : les deux visualisations nécessaires sont simples, responsives et n’exigent pas de dépendance.

## Sources de données

`dashboardService` interroge : `programmes`, `projets`, `actualites`, `membres`, `messages`, `dons`, `partenaires` et `parametres_site`.

Les indicateurs dont la requête est refusée ou dont les colonnes sont absentes restent indisponibles. Aucun fallback fictif n’est utilisé dans l’administration.

## Dons et rapports

- Les dons affichés sont des intentions. Les paiements confirmés ne sont jamais calculés ni affichés sans intégration de paiement fiable.
- L’export PDF, CSV, les modèles et l’historique de rapports ne sont pas activés : ils exigent des tables de persistance, une source de données validée et une politique d’accès.
- La méthode recommandée pour les PDF à venir est une génération côté serveur à partir d’un modèle HTML validé, afin de sécuriser les données et gérer les rapports volumineux.

## Rôles préparés

L’interface est conçue pour accueillir : `super_admin`, `administrateur`, `editeur`, `communication`, `suivi_evaluation` et `finance_lecture`.

Les rôles ne sont pas appliqués côté client avant la mise en place des politiques RLS et d’un modèle de permissions en base.

## Limites et sécurisation requise

- Les tables `messages`, `membres` et `dons` demandent des politiques de lecture/écriture administrateur.
- Les modules équipe, clusters, médiathèque complète, statistiques détaillées et rapports demandent des tables ou colonnes supplémentaires.
- Les agrégations par période, province, catégorie de bénéficiaires, budget/dépenses et historique d’activité doivent être produites par des vues, RPC ou Edge Functions.
- Les actions d’administration existantes restent dépendantes des politiques actuellement déployées.

## Tests manuels

1. Connexion avec un compte figurant dans `administrateurs`.
2. Ouverture/réduction de la sidebar sur ordinateur et ouverture du drawer sur mobile.
3. Chargement du tableau de bord avec droits complets et avec accès RLS refusé.
4. Vérification des liens vers les CRUD existants programmes, projets, actualités, partenaires, membres, galerie et paramètres.
5. Vérification qu’aucun paiement n’est présenté comme confirmé.
6. Validation clavier des liens de navigation et du menu utilisateur.
