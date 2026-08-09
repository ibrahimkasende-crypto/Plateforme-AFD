/**
 * Applique migration photo/champs employés.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadDatabaseUrl() {
  const env = fs.readFileSync(path.join(root, ".env.local"), "utf8");
  const match = env.match(/^DATABASE_URL=(.*)$/m);
  if (!match) throw new Error("DATABASE_URL manquant");
  return match[1].trim().replace(/^["']|["']$/g, "");
}

async function main() {
  const sql = fs.readFileSync(
    path.join(root, "supabase/migrations/20260804_050_employee_photo_and_fields.sql"),
    "utf8",
  );
  const client = new pg.Client({
    connectionString: loadDatabaseUrl(),
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    await client.query(sql);
    console.log("MIGRATION_050_OK");
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error("FAIL", e.message);
  process.exit(1);
});
