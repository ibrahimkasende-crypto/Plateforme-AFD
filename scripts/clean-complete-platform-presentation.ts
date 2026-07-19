/**
 * Nettoyage du lot de présentation plateforme.
 * Usage: npx tsx scripts/clean-complete-platform-presentation.ts
 */
import { createClient } from "@supabase/supabase-js";

const BATCH = "afd-platform-presentation-2026";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Variable manquante: ${name}`);
  return v;
}

async function main() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const tables = [
    "stock_mouvements",
    "stock_articles",
    "stock_entrepots",
    "stock_categories",
    "finances_transactions",
    "indicateur_valeurs",
    "temoignage_consentements",
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().eq("demo_batch_id", BATCH);
    if (error) console.warn(table, error.message);
  }

  console.log(JSON.stringify({ ok: true, cleaned: BATCH }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
