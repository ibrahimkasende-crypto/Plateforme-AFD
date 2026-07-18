# Audit final — Dashboard administrateur AFD

Date : 2026-07-18  
Projet : `D:\Plateforme-AFD\AFD`  
Référence visuelle : `docs/references/admin-dashboard-reference.png` (1536×1024)  
Maquette source : `Maquette_AFD/Maquette_AFD_Admin.png`

---

## 1. Fichiers existants

### Shell et layout

| Fichier | Rôle |
|---|---|
| `src/app/admin/layout.tsx` | Garde `requireAdmin`, badges sidebar, enveloppe `AdminShell` |
| `src/app/admin/page.tsx` | Page SSR : parse filtres URL → `getDashboardBundle` → `AdminDashboardView` |
| `src/components/admin/admin-shell.tsx` | Fond `#f0f2f5`, sidebar fixe desktop, drawer mobile |
| `src/components/admin/admin-sidebar.tsx` | Navigation navy, badges, pied « Voir le site public » |
| `src/components/admin/admin-mobile-sidebar.tsx` | Drawer &lt; 1024px |
| `src/components/admin/admin-header.tsx` | Header sticky 72px, recherche, notifications, profil |
| `src/components/admin/admin-filters.tsx` | Filtres période/programme/province/projet + menu export |

### Widgets dashboard

| Fichier | Widget |
|---|---|
| `src/components/admin/admin-dashboard-view.tsx` | Orchestration (`data-dashboard-overview`) |
| `src/components/admin/dashboard-kpi-card.tsx` | Carte KPI (6 indicateurs) |
| `src/components/admin/dashboard-section.tsx` | Conteneur titre + description |
| `src/components/admin/dashboard-top-projects.tsx` | Top 5 projets |
| `src/components/admin/dashboard-alerts.tsx` | Liste alertes |
| `src/components/admin/dashboard-bottom-stats.tsx` | Statistiques complémentaires |
| `src/components/admin/dashboard-quick-actions.tsx` | Actions rapides |
| `src/components/charts/ChartCard.tsx` | En-tête graphique |
| `src/components/charts/index.tsx` | Recharts : évolution, statut, secteur, provinces, activités, budget |

### Données et services

| Fichier | Rôle |
|---|---|
| `src/services/dashboard.service.ts` | Agrégations Supabase directes + mode démo client |
| `src/features/statistiques/types/dashboard.ts` | Types `DashboardBundle`, KPI, filtres |
| `src/features/statistiques/hooks/use-dashboard-filters.ts` | Sync filtres ↔ query string |
| `src/features/statistiques/hooks/use-dashboard-bundle.ts` | Re-fetch client (TanStack Query) |
| `src/config/demo-data/admin-dashboard.ts` | Jeu de démo TypeScript |
| `supabase/migrations/20260718_020_admin_dashboard_rpc.sql` | Tables + RPC `get_admin_dashboard` |
| `supabase/seed-dashboard-demo.sql` | Seed SQL démo |
| `scripts/purge-dashboard-demo.sql` | Purge lot démo |

### Tests e2e existants (avant extension)

| Fichier | Couverture |
|---|---|
| `tests/e2e/admin-dashboard.spec.ts` | Smoke shell (legacy, desktop-1440) |
| `tests/e2e/admin-dashboard-responsive.spec.ts` | Overflow horizontal, menu mobile |
| `tests/e2e/admin-route-protection.spec.ts` | Redirection `/connexion` |
| `tests/e2e/admin-permissions.spec.ts` | Anonyme + login optionnel |

---

## 2. Widgets du dashboard

| # | Widget | Position grille cible | Composant |
|---|---|---|---|
| 1 | Bandeau mode démo (conditionnel) | pleine largeur | `admin-dashboard-view.tsx` |
| 2 | Barre de filtres + export | pleine largeur | `AdminFilters` |
| 3 | 6 KPI | rangée 12 col (6×2 col) | `DashboardKpiCard` ×6 |
| 4 | Évolution bénéficiaires | 6 col | `BeneficiaryEvolutionChart` |
| 5 | Projets par statut | 6 col | `ProjectStatusChart` |
| 6 | Projets par secteur | 6 col | `ProjectSectorChart` |
| 7 | Top 5 projets | 6 col | `DashboardTopProjects` |
| 8 | Bénéficiaires par province | 3 col | `BeneficiariesByProvinceChart` |
| 9 | Activités par mois | 3 col | `MonthlyActivitiesChart` |
| 10 | Budget prévu vs dépensé | 3 col (si finance) | `BudgetComparisonChart` |
| 11 | Alertes | 3 col (6 sans finance) | `DashboardAlerts` |
| 12 | Stats complémentaires | 8 col | `DashboardBottomStats` |
| 13 | Actions rapides | 4 col | `DashboardQuickActions` |
| 14 | Résumé accessible (footer) | pleine largeur | texte `accessibleSummary` |

**Grille actuelle :** Tailwind responsive (`sm`/`xl`/`2xl`), pas encore la grille 12 colonnes compacte cible documentée dans `ADMIN_DASHBOARD_FINAL_IMPLEMENTATION.md`.

---

## 3. Données statiques vs connectées

| Widget | Source actuelle (`dashboard.service.ts`) | Source cible (RPC) | Mode démo |
|---|---|---|---|
| 6 KPI | Requêtes `projets`, `partenaires`, etc. | `get_admin_dashboard` → tables mensuelles | Oui (TS + SQL) |
| Évolution bénéficiaires | Vide (sauf démo TS) | `dashboard_stats_mensuelles` | Oui |
| Projets par statut | Agrégat `projets.status` | RPC `projects_by_status` | Partiel |
| Projets par secteur | Vide (sauf démo TS) | RPC via `programmes` | Oui |
| Top 5 projets | `projets.beneficiaries` | RPC `top_projects` | Oui |
| Bénéficiaires / province | `projets.location` | `dashboard_stats_mensuelles` + fallback | Oui |
| Activités mensuelles | Vide (sauf démo TS) | `dashboard_activites_mensuelles` | Oui |
| Budget | Vide ou somme budgets projets | `dashboard_budget_mensuel` | Oui |
| Alertes | Dérivées messages/adhésions | `admin_alertes` + temps réel | Oui |
| Stats secondaires | messages, membres, dons, newsletter | RPC `secondary_stats` | Oui |
| Filtres options | programmes, projets, provinces live | RPC `filter_options` | Oui |
| Badges sidebar | Compteurs live | Idem RPC / tables métier | Oui |

**Écart principal :** le service Next.js n’appelle pas encore `get_admin_dashboard` ; la RPC et les tables existent côté Supabase.

---

## 4. Tables Supabase

### Nouvelles (migration `20260718_020`)

| Table | Usage dashboard |
|---|---|
| `dashboard_stats_mensuelles` | Bénéficiaires ventilés par mois/province |
| `dashboard_activites_mensuelles` | Activités par catégorie et mois |
| `dashboard_budget_mensuel` | Budget prévu vs dépensé |
| `admin_alertes` | Alertes administratives |

Colonnes communes démo : `is_demo`, `demo_batch_id`.

### Existantes réutilisées

| Table | Champs clés |
|---|---|
| `projets` | `status`, `beneficiaries`, `budget`, `location`, `program_id`, `is_demo` |
| `programmes` | `title`, `active` |
| `partenaires` | `active` |
| `messages` | `status` |
| `membres` | `status` (adhésions) |
| `dons` | `status`, `amount` |
| `abonnes_newsletter` | `statut` |

---

## 5. Données manquantes

| Indicateur | Statut |
|---|---|
| Ventilation genre (femmes) en production | Absente sans `dashboard_stats_mensuelles` |
| Évolution mensuelle bénéficiaires | Vide sans seed ou saisie MEAL |
| Activités agrégées | Table créée, peu alimentée en prod |
| Budget réel vs prévu | Table créée, nécessite saisie finance |
| Projets par secteur (hors démo) | Pas de champ secteur dédié — proxy via programme |
| Carte SVG RDC | Fallback barres horizontales |
| Documents téléchargés | Pas de compteur analytics |
| Rapports générés | Module rapports non branché au dashboard |
| Variations KPI (% vs période préc.) | Non calculées en mode connecté |
| Densité zero-scroll 1536×1024 | Layout encore trop vertical |

---

## 6. Écarts vs maquette (mockup diffs)

| Zone | Maquette | Implémentation actuelle |
|---|---|---|
| Sidebar | Navy `#01265d`, dégradé, item actif bleu vif | Navy proche (`#0d254e`), actif `#2563eb` |
| Fond page | `#f7f9fc` uniforme | `#f0f2f5` |
| KPI | 6 cartes compacts sur une ligne | 6 cartes OK desktop, hauteur non compactée |
| Graphiques | Hauteur fixe ~220px, légendes intégrées | Hauteur auto Recharts, padding variable |
| Carte RDC | Silhouette provinces colorées | Barres + mention « carte en cours » |
| Alertes | 3–4 items compacts scroll interne | Liste verticale pleine hauteur |
| Densité globale | Tout visible sans scroll page | Scroll vertical requis à 1536×1024 |
| Typo titres | Semi-bold 14px labels, 28px KPI | `font-display` 2xl KPI, labels 14px |
| Primary CTA | `#0865d8` | `#2563eb` / `#0877d1` mélangés |

---

## 7. Problèmes de dimensions

- Header fixe 72px + padding main `p-4 md:p-6` consomment ~100px avant le contenu.
- `space-y-6` entre sections ajoute 24px × 7 ≈ 168px d’espacement vertical.
- KPI cards `p-5` + icône 44px : hauteur ~140px vs ~110px cible.
- Charts sans `max-height` : certains dépassent 280px.
- Grille `2xl:grid-cols-4` dernière rangée : 4 blocs égaux trop hauts pour zero-scroll.
- Footer `accessibleSummary` visible ajoute une ligne scrollable.

---

## 8. Problèmes de couleurs

- Tokens admin cibles (`--admin-primary: #0865d8`) non appliqués globalement — voir `ADMIN_DASHBOARD_COLOR_TOKENS.md`.
- Mélange `#2563eb`, `#0877d1`, `#0d254e` dans composants au lieu des tokens.
- Sidebar fond `#0d254e` ≠ `#01265d` cible.
- Fond shell `#f0f2f5` ≠ `#f7f9fc` cible.
- Graphiques : palette partiellement alignée en démo, pas centralisée via tokens accent.

---

## 9. Problèmes typographiques

- Titres graphiques : `ChartCard` utilise styles génériques, pas la hiérarchie maquette (14px medium label, 16px semibold titre section).
- KPI : `text-2xl` OK desktop, trop grand en mode compact cible.
- Sidebar : labels 14px — conforme ; badges 10px — conforme.
- Manque mode densité (`comfortable` / `compact`) pour ajuster tailles.

---

## 10. Problèmes fonctionnels

| Problème | Gravité |
|---|---|
| RPC `get_admin_dashboard` non consommée par le service | Haute |
| Filtre `period` en URL sans effet sur les requêtes service | Moyenne |
| Export CSV client-only, pas de permission `dashboard.export` vérifiée | Moyenne |
| Routes quick actions (`/admin/activites/nouveau`, etc.) parfois placeholders | Basse |
| Mode démo : double source TS vs SQL selon environnement | Moyenne |
| `admin-dashboard.spec.ts` legacy accède `/admin` sans auth (obsolète) | Basse |

---

## 11. État responsive et zero-scroll

| Viewport | Scroll vertical page | Scroll horizontal |
|---|---|---|
| 1536×1024 (cible) | **Requis aujourd’hui** — objectif zéro | OK |
| 1440×900 | Requis | OK |
| 768×1024 (tablette) | Autorisé (empilement) | OK |
| 320–430 (mobile) | Autorisé | Testé sans débordement |

Test Playwright `admin-dashboard-layout.spec.ts` encode la cible zero-scroll via `[data-dashboard-overview]` et `scrollHeight ≤ clientHeight`.

---

## 12. Plan de correction

### Phase A — Données (priorité haute)

1. Brancher `getDashboardBundle` sur `supabase.rpc('get_admin_dashboard', …)`.
2. Mapper la réponse JSON RPC → types `DashboardBundle`.
3. Exécuter `supabase/seed-dashboard-demo.sql` en dev/recette.
4. Activer `NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA=true` (alias `NEXT_PUBLIC_AFD_ADMIN_DEMO`).

### Phase B — Visuel (priorité haute)

1. Introduire tokens `--admin-*` dans `globals.css` (scope `.admin-shell`).
2. Grille 12 colonnes + mode densité `compact` par défaut à ≥1536px.
3. Fixer hauteurs charts (`h-[220px]`) et alertes (`max-h-[220px] overflow-y-auto`).
4. Réduire `space-y-6` → `space-y-4` en mode compact.
5. Capturer screenshot référence : `tests/visual/admin-dashboard-1536x1024.png`.

### Phase C — Permissions et export

1. Vérifier `dashboard.view` (`dashboard:read`) à l’entrée layout.
2. Masquer budget si absence de `dashboard.view_finance` (`finances:read`).
3. Désactiver export si absence de `dashboard.export` (`rapports:export`).

### Phase D — Qualité

1. Suite e2e scindée : layout, data, filters, actions, permissions, responsive.
2. Mettre à jour `ADMIN_DASHBOARD_VISUAL_COMPARISON.md` après capture.
3. Supprimer ou migrer `admin-dashboard.spec.ts` vers les nouveaux specs.
