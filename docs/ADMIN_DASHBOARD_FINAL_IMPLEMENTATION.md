# Implémentation finale — Dashboard administrateur AFD

Date : 2026-07-18  
Route : `/admin`  
Référence : `docs/references/admin-dashboard-reference.png`

---

## 1. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ AdminLayout (SSR)                                           │
│  requireAdmin() → AdminShell(viewer, badges)                │
│    ├─ AdminSidebar / AdminMobileSidebar                     │
│    ├─ AdminHeader (72px sticky)                             │
│    └─ main → AdminDashboardPage                             │
│         parseDashboardFilters(searchParams)                 │
│         getDashboardBundle(filters)  ← service / RPC        │
│         AdminDashboardView [data-dashboard-overview]        │
└─────────────────────────────────────────────────────────────┘
```

### Couches

| Couche | Fichiers |
|---|---|
| Page | `src/app/admin/page.tsx` |
| Vue | `src/components/admin/admin-dashboard-view.tsx` |
| Service | `src/services/dashboard.service.ts` |
| Hooks client | `use-dashboard-filters`, `use-dashboard-bundle` |
| Types | `src/features/statistiques/types/dashboard.ts` |
| Démo TS | `src/config/demo-data/admin-dashboard.ts` |
| Supabase | `get_admin_dashboard` + 4 tables agrégats |

---

## 2. Grille 12 colonnes

Objectif desktop ≥1280px : une grille CSS `grid-cols-12 gap-4` avec spans explicites.

| Rangée | Col span | Widget |
|---|---|---|
| 1 | 12 | Filtres |
| 2 | 2×6 ou 6×2 | 6 KPI (2 col chacun) |
| 3 | 6 + 6 | Évolution bénéficiaires + Statut |
| 4 | 6 + 6 | Secteur + Top 5 projets |
| 5 | 3 + 3 + 3 + 3 | Province + Activités + Budget + Alertes |
| 6 | 8 + 4 | Stats complémentaires + Actions rapides |

**État actuel :** grilles Tailwind responsives (`xl:grid-cols-2`, `2xl:grid-cols-6`) — migration vers `grid-cols-12` prévue phase B de l’audit.

Attribut test : `[data-dashboard-overview]` sur le conteneur racine du dashboard.

---

## 3. Modes de densité

| Mode | Breakpoint | Espacement | Hauteur charts |
|---|---|---|---|
| `comfortable` | &lt;1280px | `space-y-6`, KPI `p-5` | auto |
| `compact` | ≥1536×1024 | `space-y-4`, KPI `p-4` | `220px` fixe |

Activation prévue via `data-density="compact"` sur `[data-dashboard-overview]` quand `window.innerWidth >= 1536`.

Objectif **zero-scroll** : tout le bloc overview tient dans `viewportHeight - headerHeight`.

---

## 4. Widgets

### KPI (6)

| Clé | Label | Icône |
|---|---|---|
| `personnesTouchees` | Personnes touchées | Users |
| `femmesTouchees` | Femmes touchées | UsersRound |
| `projetsActifs` | Projets actifs | FolderKanban |
| `activitesRealisees` | Activités réalisées | ListChecks |
| `partenairesActifs` | Partenaires actifs | Handshake |
| `budgetDepense` | Budget dépensé | Wallet |

### Graphiques (6)

1. Évolution des bénéficiaires (area stacked)
2. Projets par statut (donut)
3. Projets par secteur (barres horizontales)
4. Bénéficiaires par province (barres — fallback carte RDC)
5. Activités réalisées par mois (barres empilées)
6. Budget prévu vs dépensé (barres/grouped — gated finance)

### Sections métier

- Top 5 projets (liste avec image + bénéficiaires)
- Alertes (info / warning / critical)
- Statistiques complémentaires (6 tuiles lien)
- Actions rapides (5 liens)

---

## 5. RPC `get_admin_dashboard`

**Migration :** `supabase/migrations/20260718_020_admin_dashboard_rpc.sql`

```sql
select public.get_admin_dashboard(
  p_date_start := '2026-02-01',
  p_date_end   := '2026-07-18',
  p_programme_id := null,
  p_province := null,
  p_projet_id := null
);
```

### Paramètres

| Param | Type | Défaut |
|---|---|---|
| `p_date_start` | date | début mois M-5 |
| `p_date_end` | date | aujourd’hui |
| `p_programme_id` | uuid | null |
| `p_province` | text | null |
| `p_projet_id` | uuid | null |

### Retour JSON (clés principales)

- `summary.demo_mode`, `summary.kpis.*`
- `beneficiary_evolution[]`
- `projects_by_status[]`, `projects_by_sector[]`
- `top_projects[]`
- `beneficiaries_by_province[]`
- `monthly_activities[]`
- `budget_comparison[]`
- `alerts[]`
- `secondary_stats[]`
- `filter_options.{programmes,provinces,projects}`
- `is_demo`, `demo_batch_id`, `generated_at`

### Sécurité

- `SECURITY DEFINER` + `_dashboard_can_access()`
- Nécessite JWT authentifié + profil admin actif
- Permission `dashboard:read` ou rôle équivalent

**Écart :** `dashboard.service.ts` interroge encore les tables directement ; branchement RPC = prochaine étape.

---

## 6. Mode démo

### Sources

| Source | Quand |
|---|---|
| `adminDashboardDemoBundle` (TS) | Dev, Supabase absent ou données vides |
| `seed-dashboard-demo.sql` | Données SQL marquées `is_demo=true` |
| RPC détection | `is_demo` / `demo_batch_id` dans réponse |

### Variables d’environnement

| Variable | Effet |
|---|---|
| `NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA=true` | Force le mode démo (alias documenté) |
| `NEXT_PUBLIC_AFD_ADMIN_DEMO=true` | Alias actuellement lu par le service |
| `NEXT_PUBLIC_AFD_ADMIN_DEMO=false` | Désactive le fallback démo |
| `NODE_ENV=production` | Jamais de démo TS automatique |

### UI

- Bandeau ambre : « Mode démonstration »
- Badge + notice depuis `ADMIN_DEMO_BADGE` / `ADMIN_DEMO_NOTICE`

---

## 7. Filtres URL

| Query param | Valeur |
|---|---|
| `period` | `7d` \| `30d` \| `quarter` \| `year` \| `custom` |
| `programme` | UUID programme |
| `province` | Nom province |
| `project` | UUID projet |
| `from` / `to` | Dates ISO (période custom) |

Hook : `useDashboardFilters` → `router.replace` sans rechargement complet.

---

## 8. Export

Menu « Exporter » dans `AdminFilters` :

| Action | Implémentation |
|---|---|
| Impression | `window.print()` |
| CSV | Génération client depuis KPI |
| Nouveau rapport | Lien `/admin/rapports/nouveau` |

Permission cible : `dashboard.export` (mapping `rapports:export`).

---

## 9. Tests Playwright

| Fichier | Projet | Objectif |
|---|---|---|
| `admin-dashboard-layout.spec.ts` | `desktop-1536` | Zero-scroll, 6 KPI, sidebar, capture visuelle |
| `admin-dashboard-data.spec.ts` | `desktop-1440` | Labels, graphiques, alertes, stats |
| `admin-dashboard-filters.spec.ts` | `desktop-1440` | Query string filtres |
| `admin-dashboard-actions.spec.ts` | `desktop-1440` | Quick actions, export |
| `admin-dashboard-permissions.spec.ts` | `desktop-1440` | Redirect anonyme |
| `admin-dashboard-responsive.spec.ts` | mobile/tablet | Scroll autorisé, pas d’overflow horizontal |

Credentials optionnels : `AFD_E2E_ADMIN_EMAIL`, `AFD_E2E_ADMIN_PASSWORD`.

Helper : `tests/e2e/helpers/admin-auth.ts`.

Config : `playwright.config.ts` — projet `desktop-1536` (1536×1024).

---

## 10. Checklist déploiement

- [ ] Appliquer migration `20260718_020_admin_dashboard_rpc.sql`
- [ ] Seed démo dev : `supabase db execute -f supabase/seed-dashboard-demo.sql`
- [ ] Brancher service sur RPC
- [ ] Appliquer tokens `--admin-*`
- [ ] Grille compacte 1536 zero-scroll
- [ ] Exécuter suite e2e dashboard
- [ ] Mettre à jour capture visuelle de référence
