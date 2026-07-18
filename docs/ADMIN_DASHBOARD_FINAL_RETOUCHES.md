# Dashboard admin — retouches finales

## Causes des graphiques vides

### Projets par secteur
- RPC 020 ne produisait `projects_by_sector` que si `programmes` + jointure existaient.
- Le seed dashboard initial ne créait pas de projets avec `secteur`.
- Fallback TS forçait parfois une liste vide.

### Projets par province
- Le widget affichait « Bénéficiaires par province » sans agrégat `projects_by_province`.
- Mapping province / SVG incomplet côté données.

## Corrections
- Migration `20260719_021` : colonne `secteur`, RPC `projects_by_sector` + `projects_by_province` + `presentation_mode`.
- Migration `20260719_022` : snapshots métriques secondaires.
- Seed `seed-admin-presentation-data.sql` (lot `afd-presentation-2024-2026`).
- Service TS : calcul secteur / province depuis `projets.secteur` et `location`.
- Widget renommé « Projets par province » (carte RDC + classement).
- Badge unique « Mode présentation » dans le header.
- Sidebar pliable, densité CSS, widgets secondaires compactés.
- Login : fond univers Canvas 2D.

## Densité (1536×1024)
- `--admin-content-gap: 7px`
- `--admin-kpi-row-height: 88px`
- `--admin-secondary-row-height: 76px`
- Photo bas de sidebar supprimée → bouton « Voir le site public »
