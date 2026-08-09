# Système de gestion RH

## Architecture

Module RH introduit par `20260719_050_identity_hr_payroll.sql`.

### Entités principales

| Table | Rôle |
|-------|------|
| `hr_departements` | Structure organisationnelle |
| `hr_postes` | Fiches de poste |
| `hr_employes` | Dossier employé (lien optionnel `user_id`) |
| `hr_contrats` | Contrats et salaire de base |
| `hr_presences` | Pointage journalier |
| `hr_conges` / `hr_soldes_conges` | Demandes et soldes |
| `hr_recrutements` / `hr_candidatures_rh` | Recrutement interne |
| `hr_onboarding_taches` | Checklist intégration |
| `hr_performance_cycles` / `hr_evaluations` | Performance |
| `hr_formations` | Formation |
| `hr_documents` | Documents privés (bucket `hr-private`) |
| `hr_departs` | Offboarding |

### Routes admin

| Route | Permission nav |
|-------|----------------|
| `/admin/rh/personnel` | `hr.view` |
| `/admin/rh/departements` | `hr.view` |
| `/admin/rh/recrutement` | `hr.manage_recruitment` |
| `/admin/rh/presences` | `hr.manage_attendance` |
| `/admin/rh/conges` | `hr.manage_leave` |
| `/admin/rh/performance` | `hr.manage_performance` |
| `/admin/rh/formations` | `hr.manage_training` |

### Services / actions

- `src/features/hr/actions/manage-employee.ts`
- `src/features/hr/services/employees.service.ts`

### Données démo

```bash
CONFIRM=yes npm run seed:hr
CONFIRM=yes npm run seed:hr:clean
```

Lot : `afd-hr-presentation-2026` (`is_demo=true`, emails `@demo.afd.local`).

## Sécurité

- RLS activée sur tables RH sensibles.
- Données privées : permission `hr.view_private`.
- Documents : permissions `hr_documents.*`, bucket privé.

Voir aussi : `docs/HR_EMPLOYEE_LIFECYCLE.md`, `docs/HR_RLS_POLICIES.md`.

