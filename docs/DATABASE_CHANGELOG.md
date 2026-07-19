# Changelog base de données — Plateforme-AFD

## 2026-07-19 — `20260719_051_secure_foundations.sql`

### Objectif
Vague 1 : durcir RLS migration 030, fondations workflows/jobs/notifications/référentiels, socle stocks/logistique.

### Changements
- `has_permission` / `has_role` : `platform_owner` équivalent super_admin
- Remplacement politiques `USING (true)` des tables 030 par `has_permission` + `is_active_admin`
- Tables : `workflow_*`, `approval_*`, `background_jobs*`, `notifications*`, `ref_*`
- Vue `v_audit_unified` (audit_logs + journal_activite)
- Trigger append-only sur `audit_logs`
- Tables stocks : `stock_categories`, `stock_entrepots`, `stock_articles`, `stock_mouvements`, vue `v_stock_disponibles`
- Tables logistique : `logistique_demandes`, `logistique_vehicules`, `logistique_missions`

### Non destructif
- Aucune table 030 droppée
- Politiques anciennes droppées puis recréées

### Vérification
- `npx supabase db query --linked -f ...051...` OK
- Script `tests/rls/wave1_foundations_rls.sql`
