# Seed démo — Dashboard administrateur AFD

Date : 2026-07-18  
Fichier : `supabase/seed-dashboard-demo.sql`  
Purge : `scripts/purge-dashboard-demo.sql`

---

## 1. Identifiant de lot

| Constante | Valeur |
|---|---|
| `demo_batch_id` | `afd-dashboard-demo-2026-07` |
| `is_demo` | `true` sur toutes les lignes insérées |

Le lot est **idempotent** : le script supprime d’abord les lignes existantes du même `demo_batch_id` avant réinsertion.

---

## 2. Contenu inséré

### `dashboard_stats_mensuelles`

- **6 mois** : février → juillet 2026
- **8 provinces** : Kinshasa, Kwilu, Kwango, Haut-Katanga, Ituri, Tshopo, Tshuapa, Nord-Kivu
- Ventilation femmes/hommes/enfants/jeunes (55/22/14/9 %)
- Total cible mois 7 : **2 015** bénéficiaires agrégés

### `dashboard_activites_mensuelles`

- 6 mois × 6 catégories (Formations, Sensibilisations, Distributions, Réunions, Missions, Autres)
- Valeurs croissantes (`base + idx * 2`)

### `dashboard_budget_mensuel`

- 6 mois USD : prévu 95k→145k, dépense 82k→132k

### `admin_alertes`

- **10 alertes** : warning, critical, info
- Exemples : rapport MEAL, projet inactif, messages non traités, budget dépassé, indicateur manquant

---

## 3. Exécution

### Supabase CLI (local)

```bash
cd D:\Plateforme-AFD\AFD
supabase db execute -f supabase/seed-dashboard-demo.sql
```

### psql direct

```bash
psql "$DATABASE_URL" -f supabase/seed-dashboard-demo.sql
```

### Prérequis

- Migration `20260718_020_admin_dashboard_rpc.sql` appliquée (tables créées)

---

## 4. Purge

Fichier : `scripts/purge-dashboard-demo.sql`

```sql
-- Supprime toutes les lignes du lot afd-dashboard-demo-2026-07
delete from dashboard_stats_mensuelles where demo_batch_id = 'afd-dashboard-demo-2026-07';
-- ... idem activites, budget, alertes
```

Modifier `v_batch` dans le bloc `DO $$` pour purger un autre lot.

---

## 5. Variable d’environnement

| Variable | Valeurs | Effet |
|---|---|---|
| `NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA` | `true` / `false` | **Documentée** — active le fallback démo côté client |
| `NEXT_PUBLIC_AFD_ADMIN_DEMO` | `true` / `false` | **Implémentée** dans `dashboard.service.ts` |

### Logique actuelle (`shouldUseDemo`)

1. `NODE_ENV === 'production'` → jamais de démo TS automatique
2. `NEXT_PUBLIC_AFD_ADMIN_DEMO === 'false'` → désactivé
3. `NEXT_PUBLIC_AFD_ADMIN_DEMO === 'true'` → forcé
4. Sinon : démo si données Supabase insuffisantes

**Recommandation :** lire les deux variables :

```typescript
const demoEnabled =
  process.env.NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA === "true" ||
  process.env.NEXT_PUBLIC_AFD_ADMIN_DEMO === "true";
```

---

## 6. Interaction RPC vs seed SQL

| Scénario | Comportement |
|---|---|
| Seed SQL exécuté + RPC branchée | `is_demo=true`, KPI alimentés, pas de bandeau TS si RPC détecte démo SQL |
| Seed SQL + service direct (actuel) | Données SQL ignorées tant que RPC non branchée |
| Pas de seed + dev | Fallback `adminDashboardDemoBundle` (TypeScript) |
| Production | Uniquement données réelles (`is_demo=false`) |

---

## 7. Sécurité

- **Ne pas** exécuter automatiquement en production (commentaire en tête du fichier seed).
- Les lignes démo sont identifiables via `demo_batch_id` pour audit et purge.
- La RPC exclut `is_demo=true` des agrégats prod sur tables métier ; les tables dashboard acceptent les lignes démo pour la démo explicite.

---

## 8. Vérification post-seed

```sql
select 'stats' as t, count(*) from dashboard_stats_mensuelles where demo_batch_id = 'afd-dashboard-demo-2026-07'
union all
select 'activites', count(*) from dashboard_activites_mensuelles where demo_batch_id = 'afd-dashboard-demo-2026-07'
union all
select 'budget', count(*) from dashboard_budget_mensuel where demo_batch_id = 'afd-dashboard-demo-2026-07'
union all
select 'alertes', count(*) from admin_alertes where demo_batch_id = 'afd-dashboard-demo-2026-07';
```

Attendu : stats 48 (8×6), activites 36 (6×6), budget 6, alertes 10.

---

## 9. UI bandeau démo

Quand `bundle.demoMode === true` :

- Titre : **Mode démonstration**
- Notice : *Données de démonstration — non représentatives de l’impact réel de l’AFD.*

Sources possibles du flag :

- Service TS (`adminDashboardDemoBundle`)
- RPC (`summary.demo_mode` / `is_demo`)
