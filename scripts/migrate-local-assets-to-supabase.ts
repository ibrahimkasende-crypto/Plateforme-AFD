/**
 * Migration contrôlée des images métier locales vers Supabase Storage.
 *
 * Usage (après configuration des variables serveur) :
 *   npx tsx scripts/migrate-local-assets-to-supabase.ts --dry-run
 *
 * Ne supprime jamais les fichiers locaux automatiquement.
 * Ne pas exécuter sans SUPABASE_SERVICE_ROLE_KEY côté serveur.
 */

import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

type InventoryItem = {
  absolutePath: string;
  relativePath: string;
  bucket: string;
  hash: string;
  size: number;
};

const ROOT = path.resolve(__dirname, "..");
const LOCAL_ROOT = path.join(ROOT, "public", "images", "afd");

const BUCKET_MAP: Record<string, string> = {
  programmes: "programmes",
  actualites: "actualites",
  impact: "histoires-impact",
  "actions-terrain": "site-public",
  home: "site-public",
};

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (/\.(jpe?g|png|webp|gif|pdf)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function inventory(): Promise<InventoryItem[]> {
  const files = await walk(LOCAL_ROOT);
  const items: InventoryItem[] = [];

  for (const absolutePath of files) {
    const relativePath = path.relative(LOCAL_ROOT, absolutePath).replace(/\\/g, "/");
    const top = relativePath.split("/")[0] ?? "site-public";
    const bucket = BUCKET_MAP[top] ?? "site-public";
    const buffer = await fs.readFile(absolutePath);
    const hash = createHash("sha256").update(buffer).digest("hex");
    items.push({
      absolutePath,
      relativePath,
      bucket,
      hash,
      size: buffer.byteLength,
    });
  }

  return items;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  console.log("=== Migration médias locaux → Supabase ===");
  console.log(`Racine : ${LOCAL_ROOT}`);
  console.log(`Mode : ${dryRun ? "dry-run" : "écriture"}`);

  if (!dryRun && !hasServiceKey) {
    console.error(
      "Refus : SUPABASE_SERVICE_ROLE_KEY absente. Relancez en --dry-run ou configurez la clé serveur.",
    );
    process.exit(1);
  }

  const items = await inventory();
  console.log(`Fichiers inventoriés : ${items.length}`);

  const reportPath = path.join(ROOT, "docs", "LOCAL_MEDIA_MIGRATION_REPORT.md");
  const lines = [
    "# Rapport de migration médias locaux",
    "",
    `Date : ${new Date().toISOString()}`,
    `Mode : ${dryRun ? "dry-run" : "écriture"}`,
    `Fichiers : ${items.length}`,
    "",
    "| Fichier | Bucket | Hash | Taille |",
    "|---------|--------|------|--------|",
    ...items.map(
      (item) =>
        `| ${item.relativePath} | ${item.bucket} | \`${item.hash.slice(0, 12)}\` | ${item.size} |`,
    ),
    "",
    dryRun
      ? "Aucun upload effectué (dry-run)."
      : "Uploads à brancher via client service_role (non exécutés automatiquement ici sans confirmation).",
    "",
    "Les fichiers locaux ne sont pas supprimés.",
  ];

  await fs.writeFile(reportPath, lines.join("\n"), "utf8");
  console.log(`Rapport écrit : ${reportPath}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
