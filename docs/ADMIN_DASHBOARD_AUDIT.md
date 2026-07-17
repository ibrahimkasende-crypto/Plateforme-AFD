# Audit — Dashboard administrateur Plateforme-AFD

Date : 2026-07-17  
Projet : `D:\Plateforme-AFD\AFD`  
Maquette : `D:\Plateforme-AFD\Maquette_AFD\Maquette_AFD_Admin.png`

## 1. Composants déjà disponibles

| Élément | Chemin | État |
|---|---|---|
| Layout admin | `src/app/admin/layout.tsx` | Minimal (sidebar claire + header texte) |
| Sidebar | `src/components/admin/AdminSidebar.tsx` | Blanc, pas navy, pas mobile |
| DataTable | `src/components/admin/DataTable.tsx` | Non utilisé |
| Dashboard page | `src/app/admin/page.tsx` | KPI « — » + EmptyState graphs |
| Charts Recharts | `src/components/charts/index.tsx` | Présents, palette verte, peu adaptés maquette |
| ChartCard / StatCard | shared | Réutilisables mais génériques |
| Navigation | `src/config/admin-navigation.ts` | Groupée, dense |
| Permissions / rôles | `src/config/permissions.ts`, `roles.ts` | Déclaratif, non appliqué |
| QueryProvider | `src/providers/query-provider.tsx` | Prêt, inutilisé |
| Demo notice | `src/config/demo-data/index.ts` | KPI à 0 |

## 2. Composants à reconstruire

- Sidebar navy style maquette + badges + pied institutionnel
- Header (recherche, notifications, messages, profil, fullscreen)
- Drawer mobile
- Filtres dashboard + export
- KPI avec variation / icônes colorées
- Graphiques dédiés (fichiers séparés, palette AFD)
- Top projets, alertes, accès rapides, stats secondaires
- Carte RDC (SVG ou fallback barres)
- Shell layout responsive

## 3. Données Supabase existantes

Tables utilisables : `projets`, `programmes`, `partenaires`, `dons`, `messages`, `membres`, `actualites`, `galerie`, `membres_equipe`, `clusters`, `parametres_site`, `administrateurs`.  
Table newsletter : `abonnes_newsletter` (migration, hors types générés).

## 4. Statistiques calculables

- Projets actifs / par statut (champ `status`)
- Bénéficiaires agrégés (`projets.beneficiaries`)
- Partenaires actifs
- Messages / adhésions en attente (`status`)
- Intentions de dons (`dons`)
- Provinces via `location` des projets

## 5. Données manquantes

Activités, indicateurs MEAL, budgets financiers structurés, histoires, rapports générés, documents téléchargés, évolution mensuelle bénéficiaires ventilée (femmes/hommes/enfants/jeunes).

## 6. Graphiques déjà présents

9 composants dans `charts/index.tsx` — à scinder et aligner maquette (anneau + centre, barres horizontales, empilées, etc.).

## 7. Problèmes responsive

Sidebar fixe `w-72` sans drawer ; pas de hamburger ; risque de débordement horizontal.

## 8. Problèmes visuels

Sidebar blanche ≠ maquette navy ; header trop pauvre ; charts verts ; densité et badges absents.

## 9. Risques de régression

Ne pas modifier le layout `(public)` ni les composants homepage. Préférer nouveaux composants `admin/*` plutôt que de casser `StatCard` public. Isoler styles admin.

## 10. Plan d’implémentation

1. Layout + shell + sidebar + header  
2. Navigation maquette + badges  
3. Services / types / hooks / demo  
4. Page dashboard (filtres, KPI, graphs, alertes, quick actions)  
5. Permissions finance  
6. Responsive + e2e + docs + commit local
