# Checklist validation légale paie RH

> **Avertissement** : le moteur et les règles `DEMO_*` fournis avec la plateforme AFD sont des **artefacts de démonstration**. Ils ne remplacent pas une validation par un expert en droit social et fiscal congolais (RDC).

## Avant mise en production

### 1. Règles légales

- [ ] Remplacer toutes les règles `DEMO_*` par des règles sourcées (CNSS, DGI, conventions)
- [ ] Renseigner `source_title`, `source_reference`, `source_document_id`
- [ ] Passer `statut_validation = verified` avec `verified_by` / `verified_at`
- [ ] Définir `effective_from` / `effective_to` corrects
- [ ] Désactiver `allowUnverifiedRules` en production

### 2. Barèmes et plafonds

- [ ] Vérifier plafonds CNSS (`ceiling` / `floor` sur règles)
- [ ] Impôt progressif via `brackets` JSON si applicable
- [ ] Heures sup : taux légaux et contingent

### 3. Composants salariaux

- [ ] Valider catalogue `salary_components` (taxable, contributory)
- [ ] Aligner `employee_compensation` sur contrats réels

### 4. Workflow

- [ ] Séparation des tâches : calcul ≠ approbation ≠ paiement
- [ ] Double revue RH + Finance avant `approved`
- [ ] Clôture immuable (`closed`) testée
- [ ] Procédure `payroll.reverse` documentée

### 5. Sécurité et confidentialité

- [ ] RLS vérifiée sur `payslips`, `hr_contrats`
- [ ] Bucket `hr-payslips-private` — accès signed URL uniquement
- [ ] Audit `audit_logs` pour chaque calcul et approbation
- [ ] Rétention conforme (durée légale archives paie)

### 6. Tests

- [ ] Exécuter `npm run test:unit` (tests paie démo — non légaux)
- [ ] Jeux de tests métier validés par expert paie (externe au repo)
- [ ] Test E2E avec compte RH + Finance séparés

### 7. Documentation opérationnelle

- [ ] Manuel utilisateur RH / Finance
- [ ] Procédure incident (erreur calcul, reverse)
- [ ] Contact référent juridique AFD

## Références code

- Moteur : `src/features/payroll/engine/calculate.ts`
- Run : `src/features/payroll/services/payroll-run.service.ts`
- Migration : `supabase/migrations/20260719_050_identity_hr_payroll.sql`

## Sign-off

| Rôle | Nom | Date | Signature |
|------|-----|------|-----------|
| Direction RH | | | |
| Direction Finance | | | |
| Conseil juridique | | | |
| DSI / Platform owner | | | |
