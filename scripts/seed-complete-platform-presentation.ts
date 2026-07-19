/**
 * Seed de présentation plateforme complète (données is_demo uniquement).
 * Réutilise les lots existants HR + ops si présents.
 *
 * Usage: npx tsx scripts/seed-complete-platform-presentation.ts
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

  const { error: entrepotError } = await supabase.from("stock_entrepots").upsert(
    [
      {
        code: "KIN-HQ",
        nom: "Entrepôt Kinshasa HQ",
        province: "Kinshasa",
        is_demo: true,
        demo_batch_id: BATCH,
      },
      {
        code: "GOM-EST",
        nom: "Entrepôt Goma Est",
        province: "Nord-Kivu",
        is_demo: true,
        demo_batch_id: BATCH,
      },
    ],
    { onConflict: "code" },
  );
  if (entrepotError) console.warn("entrepots:", entrepotError.message);

  const { data: article } = await supabase
    .from("stock_articles")
    .upsert(
      {
        sku: "DEMO-KIT-01",
        nom: "Kit hygiène (démo)",
        unite_code: "kit",
        seuil_min: 10,
        is_demo: true,
        demo_batch_id: BATCH,
      },
      { onConflict: "sku" },
    )
    .select("id")
    .maybeSingle();

  console.log(
    JSON.stringify(
      {
        ok: true,
        demo_batch_id: BATCH,
        articleId: article?.id ?? null,
        note: "Seed partiel — compléter avec seed:hr et seed:complete-admin si besoin",
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
