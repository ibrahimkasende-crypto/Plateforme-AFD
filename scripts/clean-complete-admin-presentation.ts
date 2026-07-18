const BATCH = "afd-complete-admin-2026";

if (process.env.CONFIRM !== "yes") {
  console.error(`
Refus : purge non confirmée.

  CONFIRM=yes npm run seed:complete-admin:clean

Seul le lot ${BATCH} sera supprimé.
`);
  process.exit(1);
}

console.log(`
Purge SQL (lot ${BATCH}) — exécuter dans Supabase :

DO $$
DECLARE v_batch text := '${BATCH}';
BEGIN
  DELETE FROM public.activites WHERE demo_batch_id = v_batch;
  DELETE FROM public.beneficiaires_agregats WHERE demo_batch_id = v_batch;
  DELETE FROM public.urgences WHERE demo_batch_id = v_batch;
  DELETE FROM public.newsletter_campagnes WHERE demo_batch_id = v_batch;
  DELETE FROM public.newsletter_modeles WHERE demo_batch_id = v_batch;
  DELETE FROM public.finances_budgets WHERE demo_batch_id = v_batch;
  DELETE FROM public.finances_depenses WHERE demo_batch_id = v_batch;
  DELETE FROM public.rapports_generes WHERE demo_batch_id = v_batch;
  DELETE FROM public.departements WHERE demo_batch_id = v_batch;
  DELETE FROM public.partenariats_demandes WHERE demo_batch_id = v_batch;
  IF to_regclass('public.messages') IS NOT NULL THEN
    DELETE FROM public.messages WHERE demo_batch_id = v_batch;
  END IF;
  IF to_regclass('public.membres') IS NOT NULL THEN
    DELETE FROM public.membres WHERE demo_batch_id = v_batch;
  END IF;
  IF to_regclass('public.dons') IS NOT NULL THEN
    DELETE FROM public.dons WHERE demo_batch_id = v_batch;
  END IF;
  IF to_regclass('public.clusters') IS NOT NULL THEN
    DELETE FROM public.clusters WHERE demo_batch_id = v_batch;
  END IF;
END $$;
`);

process.exit(0);
