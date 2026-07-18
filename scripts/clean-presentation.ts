import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BATCH = "afd-presentation-2024-2026";
const ROOT = resolve(process.cwd());
const CLEAN_FILE = resolve(ROOT, "supabase/clean-presentation.sql");

const CLEAN_SQL = `-- Purge UNIQUEMENT le lot de présentation ${BATCH}
DO $$
DECLARE
  v_batch text := '${BATCH}';
  tbl text;
BEGIN
  IF to_regclass('public.projets') IS NOT NULL THEN
    DELETE FROM public.projets WHERE demo_batch_id = v_batch;
  END IF;
  IF to_regclass('public.programmes') IS NOT NULL THEN
    DELETE FROM public.programmes WHERE demo_batch_id = v_batch;
  END IF;
  IF to_regclass('public.dashboard_stats_mensuelles') IS NOT NULL THEN
    DELETE FROM public.dashboard_stats_mensuelles WHERE demo_batch_id = v_batch;
  END IF;
  IF to_regclass('public.dashboard_activites_mensuelles') IS NOT NULL THEN
    DELETE FROM public.dashboard_activites_mensuelles WHERE demo_batch_id = v_batch;
  END IF;
  IF to_regclass('public.dashboard_budget_mensuel') IS NOT NULL THEN
    DELETE FROM public.dashboard_budget_mensuel WHERE demo_batch_id = v_batch;
  END IF;
  IF to_regclass('public.admin_alertes') IS NOT NULL THEN
    DELETE FROM public.admin_alertes WHERE demo_batch_id = v_batch;
  END IF;
  IF to_regclass('public.dashboard_metric_snapshots') IS NOT NULL THEN
    DELETE FROM public.dashboard_metric_snapshots WHERE demo_batch_id = v_batch;
  END IF;

  FOREACH tbl IN ARRAY ARRAY[
    'messages', 'membres', 'dons', 'abonnes_newsletter'
  ]
  LOOP
    IF to_regclass(format('public.%I', tbl)) IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = tbl
          AND column_name = 'demo_batch_id'
      )
    THEN
      EXECUTE format('DELETE FROM public.%I WHERE demo_batch_id = $1', tbl)
        USING v_batch;
    END IF;
  END LOOP;

  RAISE NOTICE 'Lot présentation % purgé (données officielles intactes).', v_batch;
END $$;
`;

function requireConfirm() {
  if (process.env.CONFIRM !== "yes") {
    console.error(`
Refus : purge de présentation non confirmée.

Relancer avec :

  CONFIRM=yes npm run seed:presentation:clean

Seul le lot ${BATCH} sera supprimé.
`);
    process.exit(1);
  }
}

async function main() {
  requireConfirm();
  writeFileSync(CLEAN_FILE, CLEAN_SQL, "utf8");
  console.log(`Fichier généré : ${CLEAN_FILE}`);

  try {
    const { execSync } = await import("node:child_process");
    execSync(`npx supabase db execute --file "${CLEAN_FILE}"`, {
      stdio: "inherit",
      cwd: ROOT,
      env: process.env,
    });
    console.log("Purge présentation appliquée via Supabase CLI.");
  } catch {
    console.log(`
CLI Supabase indisponible — exécuter manuellement :

  supabase db execute --file supabase/clean-presentation.sql
`);
    if (!existsSync(CLEAN_FILE)) process.exit(1);
    process.exit(0);
  }
}

void main();
