/**
 * Applique la migration hiérarchie utilisateurs AFD via DATABASE_URL.
 * Usage: node scripts/apply-user-hierarchy.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadDatabaseUrl() {
  const envPath = path.join(root, ".env.local");
  const env = fs.readFileSync(envPath, "utf8");
  const match = env.match(/^DATABASE_URL=(.*)$/m);
  if (!match) {
    throw new Error("DATABASE_URL manquant dans .env.local");
  }
  return match[1].trim().replace(/^["']|["']$/g, "");
}

async function main() {
  const sqlPath = path.join(
    root,
    "supabase/migrations/20260804_040_afd_user_hierarchy.sql",
  );
  const sql = fs.readFileSync(sqlPath, "utf8");
  const client = new pg.Client({
    connectionString: loadDatabaseUrl(),
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("CONNECTED");
  await client.query("BEGIN");
  try {
    await client.query(sql);
    const roles = await client.query(
      `select nom from public.roles
       where nom in ('admin_principal','admin_module','responsable','agent','lecture_seule')
       order by nom`,
    );
    const count = await client.query(
      `select public.count_active_admin_principals()::int as n`,
    );
    await client.query("COMMIT");
    console.log("ROLES=" + roles.rows.map((r) => r.nom).join(","));
    console.log("ACTIVE_PRINCIPALS=" + count.rows[0].n);
    console.log("MIGRATION_OK");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("MIGRATION_FAIL", error.message);
  process.exit(1);
});
