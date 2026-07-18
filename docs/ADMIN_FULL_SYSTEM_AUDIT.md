# Audit système administratif complet — Plateforme-AFD

Date : 2026-07-19

## Placeholders

| Texte recherché | Occurrences admin |
|---|---|
| Module en préparation | **0** (supprimé des routes `/admin`) |
| architecture validée | **0** |
| Coming soon / Under construction | **0** |

Le composant `ModulePlaceholder` a été transformé en état vide professionnel (filet de sécurité hors CRUD).

## Tableau modules (extrait)

| Module | Route | État | Table(s) | CRUD | Action |
|---|---|---|---|---|---|
| Dashboard | `/admin` | OK | RPC dashboard | lecture | — |
| Programmes | `/admin/programmes` | OK | programmes | complet | — |
| Projets | `/admin/projets` | OK | projets | complet | — |
| Activités | `/admin/activites` | OK | activites | liste+création | migration 030 |
| Bénéficiaires | `/admin/beneficiaires` | OK | beneficiaires_agregats | agrégats | migration 030 |
| Messages | `/admin/messages` | OK | messages | statut | — |
| Adhésions | `/admin/adhesions` | OK | membres | statut | — |
| Dons | `/admin/dons` | OK | dons | statut | — |
| Finances | `/admin/finances*` | OK | finances_* | budgets/dépenses | migration 030 |
| Newsletter | `/admin/newsletter*` | OK | abonnes + campagnes | OK | migration 030 |
| Paramètres | `/admin/parametres` | OK | parametres_site | onglets | header Settings |
| Journal | `/admin/journal-activite` | OK | journal_activite | lecture | — |
| Urgences | `/admin/urgences` | OK | urgences | CRUD | migration 030 |
| Clusters | `/admin/clusters` | OK | clusters | CRUD | — |

## Navigation

9 groupes accordéon ; Paramètres retiré de la sidebar → icône header.
