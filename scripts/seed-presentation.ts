import { existsSync } from "node:fs";
import { resolve } from "node:path";

const BATCH = "afd-presentation-2024-2026";
const ROOT = resolve(process.cwd());
const MIGRATION_021 = resolve(
  ROOT,
  "supabase/migrations/20260719_021_dashboard_sector_province_fix.sql",
);
const MIGRATION_022 = resolve(
  ROOT,
  "supabase/migrations/20260719_022_dashboard_secondary_metrics.sql",
);
const SEED = resolve(ROOT, "supabase/seed-admin-presentation-data.sql");

function requireConfirm() {
  if (process.env.CONFIRM !== "yes") {
    console.error(`
Refus : seed de présentation non confirmé.

Ce script est réservé au développement / préproduction.
Relancer avec :

  CONFIRM=yes npm run seed:presentation

Lot ciblé : ${BATCH}
`);
    process.exit(1);
  }
}

async function main() {
  requireConfirm();

  for (const file of [MIGRATION_021, MIGRATION_022, SEED]) {
    if (!existsSync(file)) {
      console.error(`Fichier manquant : ${file}`);
      process.exit(1);
    }
  }

  console.log(`
Seed présentation AFD — lot ${BATCH}

Étapes SQL (idempotentes) :
  1. ${MIGRATION_021}
  2. ${MIGRATION_022}
  3. ${SEED}

Exécution recommandée (Supabase SQL Editor ou CLI) :

  supabase db execute --file supabase/migrations/20260719_021_dashboard_sector_province_fix.sql
  supabase db execute --file supabase/migrations/20260719_022_dashboard_secondary_metrics.sql
  supabase db execute --file supabase/seed-admin-presentation-data.sql

Volumes attendus :
  • 10 programmes
  • 30 projets (8 provinces, 6 secteurs)
  • 192 stats mensuelles (24×8)
  • 144 activités mensuelles (24×6)
  • 24 budgets mensuels
  • 20 alertes
  • 6 métriques secondaires agrégées
  • ~1840 abonnés newsletter (emails factices @example.afd.local)

Aucune donnée officielle n’est écrasée (filtre demo_batch_id).
`);

  // Tentative CLI si disponible
  try {
    const { execSync } = await import("node:child_process");
    const run = (file: string) => {
      execSync(`npx supabase db execute --file "${file}"`, {
        stdio: "inherit",
        cwd: ROOT,
        env: process.env,
      });
    };
    run(MIGRATION_021);
    run(MIGRATION_022);
    run(SEED);
    console.log("Seed présentation appliqué via Supabase CLI.");
  } catch {
    console.log(
      "CLI Supabase indisponible ou non liée — appliquer les fichiers SQL manuellement.",
    );
    process.exit(0);
  }
}

void main();
