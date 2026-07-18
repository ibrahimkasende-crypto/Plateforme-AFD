-- Purge des données de démonstration dashboard admin.
-- Par défaut : afd-dashboard-demo-2026-07
-- Modifier v_batch ci-dessous si besoin.

do $$
declare
  v_batch text := 'afd-dashboard-demo-2026-07';
begin
  delete from public.dashboard_stats_mensuelles where demo_batch_id = v_batch;
  delete from public.dashboard_activites_mensuelles where demo_batch_id = v_batch;
  delete from public.dashboard_budget_mensuel where demo_batch_id = v_batch;
  delete from public.admin_alertes where demo_batch_id = v_batch;
end $$;
