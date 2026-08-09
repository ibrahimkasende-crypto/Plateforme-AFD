/**
 * Applique le seed Nauveau (actualités + bibliothèque) via DATABASE_URL.
 * Usage: node scripts/apply-nouveau-seed.mjs
 * Ne journalise jamais DATABASE_URL.
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
    "supabase/migrations/20260804_030_seed_nouveaux_articles_archives.sql",
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
    const actualites = await client.query(
      `select count(*)::int as n from public.actualites where source = 'rapport-terrain-afd'`,
    );
    const evenements = await client.query(
      `select count(*)::int as n from public.bibliotheque_evenements where source = 'nouveau-afd-2026'`,
    );
    const images = await client.query(
      `select count(*)::int as n from public.bibliotheque_images where source = 'nouveau-afd-2026'`,
    );
    const slugs = await client.query(
      `select slug from public.bibliotheque_evenements
       where source = 'nouveau-afd-2026'
       order by published_at nulls last, slug`,
    );
    await client.query("COMMIT");
    console.log(
      `SEED_OK actualites=${actualites.rows[0].n} evenements=${evenements.rows[0].n} images=${images.rows[0].n}`,
    );
    console.log("SLUGS=" + slugs.rows.map((r) => r.slug).join(","));
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("SEED_FAIL", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
