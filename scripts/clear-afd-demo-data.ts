/**
 * Purge uniquement les données de démonstration AFD.
 * Usage : npm run demo:clear -- --dry-run | --execute
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const BATCH = "afd-demo-client-2026";
const args = new Set(process.argv.slice(2));
const execute = args.has("--execute");

const tables = [
  "finances_depenses",
  "finances_budgets",
  "activites",
  "chiffres_impact",
  "actualites",
  "partenaires",
  "projets",
  "programmes",
];

function loadLocalEnv() {
  const file = resolve(process.cwd(), ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!match || match[1].startsWith("#") || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Variable d'environnement manquante : ${name}`);
  return value;
}

function isMissingColumn(error: { code?: string; message?: string } | null, column: string) {
  return Boolean(
    error &&
      (error.code === "42703" || error.code === "PGRST204") &&
      error.message?.includes(column),
  );
}

async function deleteDemoRows(db: ReturnType<typeof createClient>, table: string) {
  let result = await db
    .from(table as never)
    .delete()
    .eq("is_demo", true)
    .eq("demo_batch_id", BATCH);

  // Certaines versions historiques n'ont pas demo_batch_id : is_demo reste
  // impératif afin de ne jamais effacer une donnée officielle.
  if (isMissingColumn(result.error, "demo_batch_id")) {
    console.warn(`${table}: demo_batch_id absent, purge des seules lignes is_demo=true.`);
    result = await db.from(table as never).delete().eq("is_demo", true);
  }

  if (!result.error) return;
  if (/relation .* does not exist|Could not find the table/i.test(result.error.message)) {
    console.warn(`${table}: table absente, ignorée.`);
    return;
  }
  throw new Error(`${table}: ${result.error.message}`);
}

async function main() {
  if (!args.has("--dry-run") && !execute) {
    console.log("Mode sécurisé par défaut : dry-run. Utilisez --execute pour supprimer.");
  }
  if (!execute) {
    console.log(JSON.stringify({
      mode: "dry-run",
      demo_batch_id: BATCH,
      tables,
      safety: "Suppression exclusivement filtrée par is_demo=true et demo_batch_id lorsque disponible.",
    }, null, 2));
    return;
  }

  loadLocalEnv();
  const db = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } },
  );

  for (const table of tables) await deleteDemoRows(db, table);
  console.log(JSON.stringify({ ok: true, cleared: BATCH, tables }, null, 2));
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
