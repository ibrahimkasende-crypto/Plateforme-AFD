# Versionnement des règles de paie

## Table `legal_payroll_rules`

Chaque règle est identifiée par `(code, effective_from)` — contrainte unique.

| Colonne | Rôle |
|---------|------|
| `jurisdiction` | Ex. `CD` |
| `organisme` | CNSS, impôt, interne |
| `rule_type` | `social`, `tax`, `employer`, `overtime`, … |
| `rate` / `formula` | Paramètres de calcul |
| `brackets` | Barème JSON (futur) |
| `effective_from` / `effective_to` | Validité temporelle |
| `statut_validation` | `draft`, `under_review`, `verified`, `expired`, `replaced` |
| `source_title` / `source_reference` | Traçabilité légale |
| `verified_by` / `verified_at` | Validation RH/Finance |

## Cycle de vie

1. **draft** — saisie initiale (démo ou projet)
2. **under_review** — revue juridique / finance
3. **verified** — utilisable en production (`allowUnverifiedRules = false`)
4. **replaced** — nouvelle version publiée
5. **expired** — fin de validité (`effective_to`)

## Sélection à la date

`calculatePayroll` filtre via `activeRules()` :

```typescript
effective_from <= asOf AND (effective_to IS NULL OR effective_to >= asOf)
```

Priorité par `code` préféré (`DEMO_CNSS_EE`, etc.) puis première règle du type.

## Permission

Gestion : `payroll.manage_rules` (rôle `finance`, `super_admin`).

## Avertissement légal

Les règles `DEMO_*` insérées par migration **ne constituent pas** une validation légale RDC. Toute mise en production exige :

1. Validation par un expert paie / juriste
2. Passage `statut_validation = verified`
3. Checklist : `docs/HR_PAYROLL_LEGAL_VALIDATION_CHECKLIST.md`

