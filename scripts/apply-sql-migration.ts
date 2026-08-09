/**
 * Applique une migration SQL via DATABASE_URL (serveur local uniquement).
 * Usage : npx tsx scripts/apply-sql-migration.ts supabase/migrations/20260804_070_afd_main_administrators.sql
 *
 * Dépendance optionnelle : `pg` (npm i pg) si absente.
 */
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);

function loadEnv(file: string) {
  const p = resolve(process.cwd(), file);
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i <= 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

async function main() {
  loadEnv(".env.local");
  loadEnv(".env");

  const file = process.argv[2];
  if (!file) {
    console.error("Usage: tsx scripts/apply-sql-migration.ts <fichier.sql>");
    process.exit(1);
  }

  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) {
    console.error(`Fichier introuvable : ${path}`);
    process.exit(1);
  }

  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("DATABASE_URL manquant");
    process.exit(1);
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pg = require("pg") as typeof import("pg");
  const sql = readFileSync(path, "utf8");
  const client = new pg.Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    await client.query(sql);
    console.log("MIGRATION_OK", path);
    const roles = await client.query(
      `select nom from roles where nom in ('admin_principal_direction','admin_principal_it','super_admin') order by nom`,
    );
    console.log(
      "ROLES",
      roles.rows.map((r: { nom: string }) => r.nom).join(","),
    );
  } finally {
    await client.end();
  }
}

void main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
