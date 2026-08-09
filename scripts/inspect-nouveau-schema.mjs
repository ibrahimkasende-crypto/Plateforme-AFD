/**
 * Inspecte les tables liées au seed Nauveau (sans secrets).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadDatabaseUrl() {
  const env = fs.readFileSync(path.join(root, ".env.local"), "utf8");
  const match = env.match(/^DATABASE_URL=(.*)$/m);
  if (!match) throw new Error("DATABASE_URL manquant");
  return match[1].trim().replace(/^["']|["']$/g, "");
}

async function main() {
  const client = new pg.Client({
    connectionString: loadDatabaseUrl(),
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  const tables = await client.query(`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in (
        'actualites','bibliotheque_evenements','bibliotheque_images',
        'medias','domaines_intervention'
      )
    order by table_name
  `);
  console.log("TABLES=" + tables.rows.map((r) => r.table_name).join(","));

  for (const name of [
    "actualites",
    "bibliotheque_evenements",
    "bibliotheque_images",
  ]) {
    const cols = await client.query(
      `
      select column_name, data_type
      from information_schema.columns
      where table_schema = 'public' and table_name = $1
      order by ordinal_position
    `,
      [name],
    );
    if (cols.rows.length === 0) {
      console.log(`COLS_${name}=MISSING`);
    } else {
      console.log(
        `COLS_${name}=` + cols.rows.map((r) => r.column_name).join(","),
      );
    }
  }
  await client.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
