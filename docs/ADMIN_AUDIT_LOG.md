# Journal d'audit administrateur

## Tables

### `audit_logs` (append-only)

| Colonne | Usage |
|---------|-------|
| `actor_id` | Utilisateur authentifié (`auth.uid()` via RPC) |
| `action` | Code métier (`users.invite`, `payroll.calculate`, …) |
| `module` | `identity`, `hr`, `payroll`, … |
| `entity_type` / `entity_id` | Cible |
| `old_values` / `new_values` | Diff JSON |
| `reason` | Justification (obligatoire pour actions privilégiées) |
| `sensitivity` | `interne`, `sensible`, `strictement_confidentiel` |

**Mutation interdite** — trigger `audit_logs_no_update` sur UPDATE/DELETE.

### `journal_activite` (legacy auth)

Événements connexion / refus d'accès via `logAdminActivity`.

## Écriture applicative

Service : `src/features/identity/services/audit.service.ts` → RPC `append_audit_log`.

Exemples d'actions journalisées :

- `users.invite`, `users.assign_roles`, `users.disable`
- `profile.avatar.upload`, `profile.avatar.remove`
- `payroll.period.create`, `payroll.calculate`, `payroll.status.*`
- `hr.seed.demo` (seeds)

## Consultation

- UI : `/admin/journal-activite` (`journal:read`)
- Permission dédiée audit IAM : `users.view_audit`
- RLS : policy `audit_logs_select` — accès selon rôle et sensibilité

## Requêtes utiles

```sql
select created_at, action, module, entity_id, sensitivity
from audit_logs
where module = 'identity'
order by created_at desc
limit 50;
```

## Rétention

Définir une politique de rétention selon la sensibilité (recommandé : 7 ans pour paie/RH confidentiel).

Voir : `docs/IDENTITY_RBAC_HR_PAYROLL_AUDIT.md` (audit initial).
