# Politiques RLS — RH et Paie

Migration : `20260719_050_identity_hr_payroll.sql` (section RLS).

## Tables protégées

- `audit_logs`
- `hr_departements`, `hr_postes`, `hr_employes`
- `hr_contrats`, `hr_presences`, `hr_conges`
- `payroll_periods`, `payslips`
- `admin_invitations`

## Modèle d'autorisation

Combinaison de :

1. **RPC `has_permission`** — permissions granulaires
2. **Rôle primaire** — `platform_owner`, `super_admin`, `ressources_humaines`, `finance`
3. **Lien employé** — `profils_administrateurs.employe_id` pour portail limité (futur)
4. **Scopes** — `user_access_scopes` par département / programme

## Exemples de policies

### `audit_logs_select`

Lecture réservée aux rôles avec `users.view_audit` ou sensibilité adaptée.

### `hr_employes`

- SELECT : `hr.view` (+ `hr.view_private` pour champs sensibles)
- INSERT/UPDATE : `hr.manage_employees` via policies ou service role seeds

### `payslips`

- Accès salaire : `payroll.view_salary`
- Employé ne voit que ses propres bulletins (policy par `employe_id`)

## Données démo

Les seeds (`is_demo=true`, `demo_batch_id`) utilisent **service role** pour bypass RLS en dev uniquement.

## Tests

- Unitaires paie : pas de RLS (moteur pur)
- E2E : vérifient refus anonyme ; tests authentifiés si credentials fournis
- SQL manuel : voir `docs/TESTS_RLS.md` pour patterns généraux

## Vérification

```sql
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
  and tablename like 'hr_%' or tablename like 'payroll_%';
```

## Évolution

Toute nouvelle table RH/Paie doit :

1. Activer RLS
2. Définir policies SELECT / INSERT / UPDATE / DELETE
3. Documenter la permission associée dans `admin-nav-permissions.ts`

