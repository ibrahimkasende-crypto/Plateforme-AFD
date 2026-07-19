/**
 * Vérifie la cohérence basique des totaux de présentation.
 * Usage: npx tsx scripts/verify-presentation-consistency.ts
 */
import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Variable manquante: ${name}`);
  return v;
}

async function main() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { data: agregats } = await supabase
    .from("beneficiaires_agregats")
    .select("femmes, hommes, enfants, jeunes, total")
    .eq("is_demo", true)
    .limit(500);

  const inconsistencies =
    (agregats ?? []).filter((row) => {
      const expected =
        Number(row.femmes) + Number(row.hommes) + Number(row.enfants) + Number(row.jeunes);
      return expected !== Number(row.total);
    }).length;

  const { data: mouvements } = await supabase
    .from("stock_mouvements")
    .select("quantite, sens")
    .eq("is_demo", true)
    .limit(2000);
  const stockNet = (mouvements ?? []).reduce(
    (acc, m) => acc + Number(m.quantite) * Number(m.sens),
    0,
  );

  console.log(
    JSON.stringify(
      {
        ok: inconsistencies === 0,
        beneficiairesInconsistencies: inconsistencies,
        demoStockNet: stockNet,
      },
      null,
      2,
    ),
  );
  if (inconsistencies > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
