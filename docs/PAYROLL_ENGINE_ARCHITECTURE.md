# Architecture moteur de paie

## Composants

```
legal_payroll_rules (DB, versionnées)
        ↓
calculatePayroll() — src/features/payroll/engine/calculate.ts
        ↓
payroll-run.service.ts — persistance run / lignes / bulletins
        ↓
payroll_periods → payroll_runs → payroll_run_employees → payroll_lines / payslips
```

## Tables

| Table | Rôle |
|-------|------|
| `salary_components` | Catalogue composants (BASE, TRANSPORT, …) |
| `employee_compensation` | Montants par employé / composant |
| `legal_payroll_rules` | Taux et formules **versionnés** |
| `payroll_periods` | Période (statuts workflow) |
| `payroll_runs` | Exécution de calcul |
| `payroll_run_employees` | Résultat par employé |
| `payroll_lines` | Détail des lignes |
| `payslips` | Bulletins (PDF futur via `storage_path`) |

## Moteur `calculatePayroll`

Entrées : salaire base, transport, heures sup, avances, prêts, absences, règles actives à la date `asOf`.

Sorties : `brut`, `retenues`, `net`, `coutEmployeur`, `lines[]`, `anomalies[]`.

**Important** : les taux viennent exclusivement de `legal_payroll_rules`, jamais du UI.

## Règles démo (non légales)

Insérées par migration avec `statut_validation = draft` :

- `DEMO_CNSS_EE` (3,5 %), `DEMO_TAX` (10 %), `DEMO_CNSS_ER` (9 %), `DEMO_OT` (×1,5)

Flag `allowUnverifiedRules` réservé à la démo / dev.

## Service run

`calculatePeriodRun()` dans `payroll-run.service.ts` :

1. Charge période, règles, employés actifs, contrats
2. Crée `payroll_runs`
3. Calcule et insère lignes + bulletins
4. Journalise `payroll.calculate`

## Permissions

| Action | Permission |
|--------|------------|
| Voir | `payroll.view` |
| Calculer | `payroll.calculate` |
| Approuver | `payroll.approve` |
| Clôturer | `payroll.close` |
| Reverser | `payroll.reverse` |

Route : `/admin/rh/paie`.

Tests unitaires : `tests/unit/payroll-*.test.ts`.

