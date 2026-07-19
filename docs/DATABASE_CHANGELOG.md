# Changelog base de données — Plateforme-AFD

## 2026-07-19 — `20260719_054_rls_audit_function.sql`

### Objectif
Fonction `afd_rls_audit_report()` pour preuve CI du standard opérationnel.

### Vérification
- `AFD_REQUIRE_RLS=1 npm run test:rls` → 3/3 OK (anon bloqué + audit catalogue)

## 2026-07-19 — `20260719_053_waves_3_8_consolidation.sql`

### Objectif
Consolider finances (versions, transactions), valeurs d’indicateurs, sync enquêtes hors-ligne, appareils agents, consentements témoignages, snapshots santé.

### Tables / colonnes
- `finances_budgets` : version_num, statut, parent_budget_id, notes
- `finances_depenses` : justification, fournisseur, approved_*
- `finances_transactions`
- `indicateur_valeurs`
- `enquete_sync_queue`
- `agent_appareils`
- `temoignage_consentements`
- `system_health_snapshots`

### Vérification
- Appliquée via `npx supabase db query --linked -f ...053...` (pas de `db push` global)

## 2026-07-19 — `20260719_052_operations_wave2.sql`

### Objectif
Vague 2 : inventaires stock, table `clusters` manquante, membres/réunions, sitreps urgences, lignes demandes, seed entrepôts/catégories.

### Changements
- Création `clusters` si absente (constat : table absente du schéma lié)
- `cluster_membres`, `cluster_reunions`
- `urgence_sitreps`
- `stock_inventaires`, `stock_inventaire_lignes`
- `logistique_demande_lignes`
- Seed entrepôts `KIN-HQ`, `GOM-EST` + catégories ALIM/NFI/MED/LOG
- RLS via `_afd_replace_admin_policies`

### Vérification
- Appliquée via `npx supabase db query --linked -f ...052...` (éviter `db push` tant que l’historique de migrations distant est désynchronisé)
- **Ne pas** utiliser `supabase db push --linked` sans réparation de l’historique : risque de rejouer d’anciennes migrations

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
