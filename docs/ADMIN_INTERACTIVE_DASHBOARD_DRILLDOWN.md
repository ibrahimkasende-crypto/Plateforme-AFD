# Dashboard interactif — drill-down analytique

## Widgets cliquables

| Widget | Destination |
|--------|-------------|
| KPI Personnes | `/admin/analyse/beneficiaires?segment=total` |
| KPI Femmes | `/admin/analyse/beneficiaires?segment=femmes` |
| KPI Projets actifs | `/admin/analyse/projets?statut=actif` |
| KPI Activités | `/admin/analyse/activites` |
| KPI Partenaires | `/admin/analyse/partenaires?statut=actif` |
| KPI Budget | `/admin/analyse/finances?vue=depenses` |
| Évolution bénéficiaires | clic courbe / légende → analyse |
| Projets par statut | portion + légende → analyse |
| Projets par secteur | barre → `/admin/analyse/secteurs/[slug]` |
| Carte RDC | `/admin/provinces/[slug]/analyse` |
| Activités / Budget | clic barre → analyse |
| Top projets | `/admin/projets/[id]/analyse` |
| Stats secondaires | messages / adhésions / dons / newsletter |

## Contexte URL

Paramètres centralisés dans `analytics-search-params.ts` :
`period`, `programmeId`, `projetId`, `provinceId`, `secteurId`, `statut`, `segment`, `mois`, `type`, `vue`, `sourceWidget`, `dateStart`, `dateEnd`.

Bouton **Retour au tableau de bord** restaure les filtres.

## Services

`src/features/admin-analytics/services/admin-analytics.service.ts` — lectures Supabase + `requirePermission`.
Migration RPC optionnelle : `20260719_031_admin_analytics_rpc.sql`.

