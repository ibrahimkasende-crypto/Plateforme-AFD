# Workflow d'approbation paie

## Statuts période (`payroll_periods.statut`)

| Statut | Description |
|--------|-------------|
| `draft` | Création |
| `collecting_data` | Collecte RH (présences, congés) |
| `calculated` | Run calculé |
| `hr_review` | Revue RH |
| `finance_review` | Revue Finance |
| `awaiting_approval` | En attente approbation |
| `approved` | Approuvé |
| `payment_ready` | Prêt paiement |
| `partially_paid` / `paid` | Paiement |
| `closed` | Clôturé (immuable) |
| `reversed` / `cancelled` | Annulation |

## Rôles et permissions

| Étape | Permission |
|-------|------------|
| Calcul | `payroll.calculate` |
| Revue RH | `payroll.review_hr` |
| Revue Finance | `payroll.review_finance` |
| Approbation | `payroll.approve` |
| Marquer payé | `payroll.mark_paid` |
| Clôture | `payroll.close` |
| Reverse | `payroll.reverse` |

## Transitions

Service : `advancePayrollStatus()` dans `payroll-run.service.ts`.

- Refuse modification si `statut = closed`
- Journalise `payroll.status.{next}` via `appendAuditLog`
- Sensibilité : `strictement_confidentiel`

Actions serveur : `src/features/payroll/actions/manage-payroll.ts`.

## Règles métier

1. Une période **clôturée** ne peut plus être recalculée.
2. Toute anomalie bloquante (`net négatif`) marque la ligne employé `blocked`.
3. Les bulletins (`payslips`) sont générés à chaque run.

## Routes

- `/admin/rh/paie` — vue d'ensemble
- `/admin/rh/paie/periodes/[id]` — détail période
- `/admin/rh/paie/bulletins` — bulletins (`payroll.view_salary`)

## Audit

Consulter `audit_logs` où `module = 'payroll'` pour traçabilité des transitions.

