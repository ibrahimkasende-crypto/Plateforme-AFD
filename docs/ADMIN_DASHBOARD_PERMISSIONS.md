# Permissions — Dashboard administrateur AFD

Date : 2026-07-18

---

## 1. Modèle de permissions cible

| Permission documentée | Permission implémentée | Description |
|---|---|---|
| `dashboard.view` | `dashboard:read` | Accéder au tableau de bord `/admin` |
| `dashboard.view_finance` | `finances:read` | Voir KPI budget et graphique budget |
| `dashboard.export` | `rapports:export` | Utiliser le menu Exporter (CSV, impression, rapport) |

Les noms avec point (`dashboard.view`) sont l’alias documentaire ; le code et Supabase utilisent la syntaxe `resource:action`.

---

## 2. Matrice rôles (extrait)

Définie dans `src/config/permissions.ts` et `supabase/migrations/20260718_005_admin_auth_roles_journal.sql`.

| Rôle | dashboard:read | finances:read | rapports:export |
|---|---|---|---|
| `super_admin` | ✓ | ✓ | ✓ |
| `administrateur` | ✓ | ✓ | ✓ |
| `finance` | ✓ | ✓ | ✓ |
| `editeur` | ✓ | — | — |
| `meal` | ✓ | — | ✓ |
| `communication` | ✓ | — | — |
| `lecteur` | ✓ | — | — |

---

## 3. Garde d’accès Next.js

### Layout admin

`src/app/admin/layout.tsx` appelle `requireAdmin()` :

1. Pas de session → redirect `/connexion?next=/admin…`
2. Profil absent / inactif / sans rôle → `/acces-refuse?raison=…`
3. Retourne `AdminSession` avec `viewer.canReadFinances`

### Navigation sidebar

`src/config/admin-nav-permissions.ts` :

```typescript
"/admin": "dashboard:read"
```

Items filtrés via `navItemAllowed()` et `roleHasPermission()`.

---

## 4. Contrôle finance (UI)

`AdminDashboardView` :

```tsx
{viewer.canReadFinances ? (
  <ChartCard title="Budget prévu vs dépensé">…</ChartCard>
) : null}
```

`canReadFinances` = `roleHasPermission(role, "finances:read")` dans `require-admin.ts`.

Sans permission :

- Graphique budget masqué
- KPI `budgetDepense` affiche « — » avec tooltip restriction
- Panneau alertes s’étend (`2xl:col-span-2`)

---

## 5. Export

Actuellement **non gated** côté UI — le menu Exporter est visible pour tout admin connecté.

**Cible :** vérifier `rapports:export` (alias `dashboard.export`) avant d’afficher le bouton :

```typescript
const canExport = roleHasPermission(role, "rapports:export");
```

Actions :

| Action | Permission requise |
|---|---|
| Impression | `dashboard.export` |
| CSV KPI | `dashboard.export` |
| Nouveau rapport | `rapports:write` ou `rapports:export` |

---

## 6. RLS Supabase — tables dashboard

Migration `20260718_020_admin_dashboard_rpc.sql`.

### Lecture (SELECT)

Toutes les tables dashboard : policy `is_active_admin()` pour rôle `authenticated`.

### Écriture (INSERT/UPDATE/DELETE)

- Agrégats mensuels : `super_admin` ou `service_role`
- Alertes : `super_admin`, `dashboard:read`, ou `service_role`

---

## 7. RPC `get_admin_dashboard`

### Fonction `_dashboard_can_access()`

Retourne `true` si :

- `auth.uid()` non null
- `is_active_admin()` = true
- ET l’une des conditions :
  - `has_permission('dashboard:read')`
  - `has_permission('statistiques:read')`
  - `has_role('super_admin' | 'administrateur' | 'editeur' | 'finance')`
  - OU au moins une entrée dans `utilisateurs_roles`

### Erreurs

| Condition | Exception |
|---|---|
| Non authentifié | `Non authentifié` |
| Profil / permission insuffisant | `Accès refusé — profil administrateur actif avec rôle requis` |

### Finance dans la RPC

La RPC retourne toujours `budget_comparison` et KPI budget ; le **filtrage finance** reste responsabilité du client (`viewer.canReadFinances`) jusqu’à extension RPC optionnelle.

---

## 8. Tests e2e

| Fichier | Scénario |
|---|---|
| `admin-dashboard-permissions.spec.ts` | Anonyme → `/connexion` |
| `admin-route-protection.spec.ts` | Routes `/admin/*` protégées |
| `admin-permissions.spec.ts` | Login réel si credentials |

Variables :

```
AFD_E2E_ADMIN_EMAIL=admin@exemple.org
AFD_E2E_ADMIN_PASSWORD=***
```

---

## 9. Checklist sécurité

- [ ] Toute route `/admin/*` passe par `requireAdmin`
- [ ] RPC révoquée pour `public`, grant `authenticated` uniquement
- [ ] RLS activé sur les 4 tables dashboard
- [ ] Export gated par `dashboard.export`
- [ ] Budget UI + RPC cohérents avec `dashboard.view_finance`
- [ ] Données démo (`is_demo`) exclues des agrégats prod sur tables métier
- [ ] Journal admin : tentatives accès refusé loguées (`logAdminActivity`)

---

## 10. Évolution prévue

1. Renommer / aliaser permissions en `dashboard.view*` dans l’UI rôles
2. Paramètre RPC `p_include_finance boolean` contrôlé par `finances:read`
3. Middleware Next.js vérifiant `dashboard:read` avant SSR dashboard
4. Tests RLS dédiés (`docs/TESTS_RLS.md`) pour tables dashboard
