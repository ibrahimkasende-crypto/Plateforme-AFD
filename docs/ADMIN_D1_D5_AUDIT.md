# Audit D1–D5 — Dashboard admin AFD

Date : 2026-07-19  
Projet : `D:\Plateforme-AFD\AFD`  
Stack : Next.js **16.2.10**, Recharts **^3.9.2**, ECharts **6.x** (ajouté), RHF **^7.81**, Zod **^4.4**

## 1. Widgets non cliquables (avant correctifs)

| Widget | État initial |
|--------|----------------|
| KPI (6) | Liens vers listes génériques (pas d’analyse) |
| Évolution bénéficiaires | Non cliquable |
| Activités par mois | Non cliquable |
| Budget prévu/dépensé | Non cliquable |
| ChartCard conteneur | Non cliquable |
| Alertes | Non affichées sur le dashboard actuel |

## 2. Graphiques partiellement cliquables

| Graphique | Clic | Destination initiale |
|-----------|------|----------------------|
| Projets par statut | Oui (portion) | `/admin/projets?statut=` |
| Projets par secteur | Oui | `/admin/projets?secteur=` (filtre ignoré) |
| Carte RDC | Oui | `/admin/projets?province=` |
| Top 5 | Oui | `/admin/projets/[id]` (404 — seule `/modifier` existait) |

## 3. Routes analytiques manquantes

Aucune route `/admin/analyse/*` ni `/admin/provinces/[slug]/analyse` ni `/admin/projets/[id]/analyse`.

## 4. Formulaires

- Admin : formulaires HTML + Server Actions uniquement.
- RHF+Zod : public/auth seulement.
- `src/components/admin/forms/` : helpers UI sans schémas.

## 5. Validation

- Serveur via Zod partiel dans actions ; client insuffisant sur modules admin.

## 6. Sidebar réduite

- Largeur 72px, icônes 17px, flyout au clic (spec : ouvrir sidebar + groupe).
- Espace vertical sous-utilisé (`space-y-2.5` sans répartition flex).

## 7. Next.js

- Version 16.2.10 — `devIndicators.position` supporté ; défaut `bottom-left` (gêne « Voir le site public »).

## 8. Indicateur de développement

- Affiché en bas à gauche en `next dev` ; absent en `build`/`start`.

## 9. Recharts

- Conservé pour le dashboard compact (KPI, donut, barres, courbes).

## 10. Graphiques à conserver (Recharts)

Dashboard principal : évolution, statut, secteur, activités, budget.

## 11. Graphiques à enrichir (ECharts)

Pages `/admin/analyse/*` : zoom, dataZoom, visualMap, interactions avancées.

## 12. Plan d’implémentation

1. Architecture analytics + params URL  
2. Routes + services Supabase  
3. Clics dashboard → analyse  
4. `devIndicators: bottom-right` + badge AFD  
5. Système formulaires modernes + migration progressive  
6. Sidebar collapsed UX  
7. Thème charts + ECharts dynamique  
8. Tests E2E + validation + commit local  

