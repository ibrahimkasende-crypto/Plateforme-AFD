/**
 * Purge du lot RH / Paie de démonstration (demo_batch_id=afd-hr-presentation-2026).
 *
 *   CONFIRM=yes npm run seed:hr:clean
 */

import { createClient } from "@supabase/supabase-js";

const BATCH = "afd-hr-presentation-2026";

const TABLES = [
  "payroll_lines",
  "payslips",
  "payroll_run_employees",
  "payroll_runs",
  "payroll_periods",
  "hr_documents",
  "hr_departs",
  "hr_discipline",
  "hr_equipements",
  "hr_formation_participants",
  "hr_formations",
  "hr_evaluations",
  "hr_performance_cycles",
  "hr_onboarding_taches",
  "hr_candidatures_rh",
  "hr_recrutements",
  "hr_soldes_conges",
  "hr_conges",
  "hr_presences",
  "hr_contrats",
  "hr_employes",
  "hr_postes",
  "hr_departements",
] as const;

function requireConfirm() {
  if (process.env.CONFIRM !== "yes") {
    console.error(`
Refus : purge RH non confirmée.

  CONFIRM=yes npm run seed:hr:clean

Seul le lot ${BATCH} sera supprimé.
`);
    process.exit(1);
  }
}

async function main() {
  requireConfirm();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    console.error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis.");
    process.exit(1);
  }

  const db = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  for (const table of TABLES) {
    const { error } = await db.from(table).delete().eq("demo_batch_id", BATCH);
    if (error && !error.message.includes("does not exist")) {
      console.warn(`  ${table}: ${error.message}`);
    }
  }

  await db
    .from("audit_logs")
    .delete()
    .eq("entity_id", BATCH)
    .eq("action", "hr.seed.demo");

  console.log(`Lot RH ${BATCH} purgé.`);
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
