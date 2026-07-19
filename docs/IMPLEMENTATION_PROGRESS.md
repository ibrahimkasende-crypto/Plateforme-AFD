## Vague 3 — Suivi / communication (partiel, 2026-07-19)

### Travail effectué
- Bénéficiaires : import CSV agrégats + détection doublons période+province
- Newsletter : envoi réel bloqué sans `EMAIL_*` ; plus de faux « Marquer envoyée »
- Banner « Configuration requise » + statut `bloque_integration_externe`
- Tests unitaires import + gate newsletter (38 tests)

### Restant Vague 3
- Indicateurs / enquêtes hors-ligne testé
- Impact / témoignages consentements complets

## Vague 2 — Opérations (en cours, 2026-07-19)

### Travail effectué
- Migration `20260719_052_operations_wave2.sql` appliquée (query ciblée)
- Stocks : entrepôts, catégories, mouvements avec jointures, transferts, alertes seuil, archivage
- Logistique : transitions de statut demandes/missions, MAJ véhicules
- Urgences : détail `[id]`, modifier, sitreps
- Clusters : table créée si absente, détail membres/réunions
- Tests unitaires transitions + règles stock (36 tests)

### Restant Vague 2
- Chaîne programme→projet→activité (détail activités, jalons)
- Inventaires stock UI complète
- Zones admin carte croisée
- Marquage `operationnel` avec preuves E2E/RLS

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
