## Vague 1 — Fondations (2026-07-19)

### Travail effectué
- Migration `20260719_051_secure_foundations.sql` appliquée sur projet lié
- RLS tables 030 durcie (`has_permission` / `is_active_admin`)
- `platform_owner` reconnu dans `has_role` / `has_permission`
- Workflows + approbations (tables + service)
- Background jobs (tables + enqueue)
- Notifications (tables + service)
- Référentiels `ref_provinces`, `ref_devises`, `ref_unites`, `ref_statuts`
- Vue `v_audit_unified` + trigger append-only `audit_logs`
- Socle stocks/logistique (tables + UI stocks/mouvements + logistique hub)
- Helpers `src/lib/auth/guards.ts`
- Composants WorkflowTimeline / ApprovalPanel
- Tests unitaires privilege-guards + stocks/payroll
- Script SQL `tests/rls/wave1_foundations_rls.sql`
- Docs DATABASE_CHANGELOG + EXTERNAL_INTEGRATIONS

### Gate Vague 1
- [x] Politiques sensibles 030 remplacées
- [x] Permissions stocks/logistique/workflows/jobs/notifications ajoutées TS + SQL
- [x] Workflows / jobs / notifications créés
- [x] Référentiels créés
- [x] CRUD partagés déjà présents (data/forms) + workflows UI
- [x] Journal append-only
- [x] typecheck OK / tests unitaires OK
- [~] Types Supabase : régénération CLI à finaliser si token types
- [~] Tests RLS SQL prêts (exécution manuelle / CI)

### Prochaine étape
Vague 2 — finaliser stocks (entrepôts seed), logistique CRUD, chaîne programme→projet→activité
