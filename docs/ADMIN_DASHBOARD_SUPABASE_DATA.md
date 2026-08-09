# Données Supabase — Dashboard administrateur AFD

Date : 2026-07-18  
Migration principale : `supabase/migrations/20260718_020_admin_dashboard_rpc.sql`

---

## 1. Vue d’ensemble

Le dashboard consomme :

1. **Quatre tables d’agrégats** dédiées (séries temporelles, alertes)
2. **Tables métier existantes** (projets, programmes, messages, etc.)
3. **Une RPC** `get_admin_dashboard` qui assemble le JSON complet

---

## 2. `dashboard_stats_mensuelles`

Agrégats mensuels de bénéficiaires ventilés par province (et optionnellement programme/projet).

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | PK |
| `mois` | date | Premier jour du mois |
| `province` | text | Nom province RDC |
| `programme_id` | uuid FK | Filtre programme (nullable) |
| `projet_id` | uuid FK | Filtre projet (nullable) |
| `femmes` | integer | Compteur femmes |
| `hommes` | integer | Compteur hommes |
| `enfants` | integer | Compteur enfants |
| `jeunes` | integer | Compteur jeunes |
| `total` | integer | Total bénéficiaires |
| `is_demo` | boolean | Marqueur démo |
| `demo_batch_id` | text | Lot démo (ex. `afd-dashboard-demo-2026-07`) |
| `created_at` | timestamptz | Horodatage insertion |

**Index :** `mois desc`, `province`, `demo_batch_id` (partiel).

**Usage RPC :**

- KPI `personnes_touchees` / `femmes_touchees` (dernier mois période)
- Série `beneficiary_evolution`
- Agrégat `beneficiaries_by_province`

---

## 3. `dashboard_activites_mensuelles`

Activités réalisées par mois et catégorie MEAL.

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | PK |
| `mois` | date | Premier jour du mois |
| `category` | text | `Formations`, `Sensibilisations`, `Distributions`, `Réunions`, `Missions`, `Autres` |
| `value` | integer | Nombre d’activités |
| `is_demo` | boolean | Marqueur démo |
| `demo_batch_id` | text | Lot démo |
| `created_at` | timestamptz | Horodatage |

**Usage RPC :**

- KPI `activites_realisees` (somme sur période)
- Série `monthly_activities` (pivot catégories → clés JSON)

---

## 4. `dashboard_budget_mensuel`

Budget prévu vs dépensé par mois.

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | PK |
| `mois` | date | Premier jour du mois |
| `prevu` | numeric | Budget prévu |
| `depense` | numeric | Dépenses réelles |
| `currency` | text | Devise (défaut `USD`) |
| `programme_id` | uuid FK | Filtre programme |
| `is_demo` | boolean | Marqueur démo |
| `demo_batch_id` | text | Lot démo |
| `created_at` | timestamptz | Horodatage |

**Usage RPC :**

- KPI `budget_depense`
- Série `budget_comparison` (prevu vs depense)

**Permission UI :** masqué si l’utilisateur n’a pas `finances:read` (`dashboard.view_finance`).

---

## 5. `admin_alertes`

Alertes administratives affichées dans le panneau « Alertes ».

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid | PK |
| `level` | text | `info` \| `warning` \| `critical` |
| `title` | text | Titre court |
| `summary` | text | Message affiché (→ `message` côté UI) |
| `href` | text | Lien d’action (défaut `/admin`) |
| `created_at` | timestamptz | Date alerte |
| `is_read` | boolean | Lu / non lu |
| `is_demo` | boolean | Marqueur démo |
| `demo_batch_id` | text | Lot démo |

**Usage RPC :** clé `alerts[]` — max 20, non lues ou dans la période.

---

## 6. Tables métier existantes

### `projets`

| Champ dashboard | Usage |
|---|---|
| `status` | Répartition par statut |
| `beneficiaries` | Fallback KPI personnes, top projets |
| `budget` | Fallback budget (service actuel) |
| `location` | Provinces, filtres |
| `program_id` | Secteur via programme, filtres |
| `active` | Exclure inactifs |
| `is_demo` | Exclure en agrégats prod |

### `programmes`

Filtres dropdown, proxy « secteur » dans RPC `projects_by_sector`.

### `partenaires`

KPI `partenaires_actifs` (count `active=true`, `is_demo=false`).

### `messages`

Stats secondaires + alertes dérivées (`status` pending/unread).

### `membres`

Adhésions en attente (`status` pending/en_attente).

### `dons`

Intentions de dons (`status` intent/pending).

### `abonnes_newsletter`

Abonnés actifs (`statut='actif'`) — table optionnelle.

---

## 7. Colonne `is_demo` étendue

La migration ajoute `is_demo boolean default false` sur :

- `projets`, `programmes`, `partenaires`, `messages`, `membres`, `dons`, `actualites`

Permet d’exclure les enregistrements de démo des agrégats production dans la RPC.

---

## 8. RPC `get_admin_dashboard`

### Entrée → sortie

```
Filtres (dates, programme, province, projet)
    ↓
_dashboard_can_access()
    ↓
Agrégats tables dashboard_* + fallback projets
    ↓
JSON DashboardBundle-compatible
```

### Détection démo

La RPC sonde `is_demo` / `demo_batch_id` sur les 4 tables dashboard pour renseigner `summary.demo_mode` et `is_demo`.

---

## 9. RLS (Row Level Security)

| Table | SELECT | ALL (insert/update/delete) |
|---|---|---|
| `dashboard_stats_mensuelles` | `is_active_admin()` | `super_admin` ou `service_role` |
| `dashboard_activites_mensuelles` | idem | idem |
| `dashboard_budget_mensuel` | idem | idem |
| `admin_alertes` | idem | `super_admin`, `dashboard:read`, ou `service_role` |

Les administrateurs authentifiés actifs lisent les agrégats ; seuls super_admin / service_role alimentent les tables (hors seed SQL direct).

---

## 10. Requêtes utiles

### Vérifier les données démo

```sql
select count(*) from dashboard_stats_mensuelles
where demo_batch_id = 'afd-dashboard-demo-2026-07';
```

### Dernier mois stats

```sql
select province, sum(total) as total
from dashboard_stats_mensuelles
where mois = (select max(mois) from dashboard_stats_mensuelles)
group by province
order by total desc;
```

### Appeler la RPC

```sql
select public.get_admin_dashboard(
  current_date - interval '6 months',
  current_date,
  null, null, null
);
```

---

## 11. Écart service Next.js

`src/services/dashboard.service.ts` interroge encore directement `projets`, `messages`, etc. sans passer par la RPC ni les tables mensuelles.

**Action recommandée :**

```typescript
const { data } = await supabase.rpc("get_admin_dashboard", {
  p_date_start: rangeStart,
  p_date_end: rangeEnd,
  p_programme_id: filters.programmeId,
  p_province: filters.province,
  p_projet_id: filters.projectId,
});
```

Puis mapper snake_case → types TypeScript existants.

