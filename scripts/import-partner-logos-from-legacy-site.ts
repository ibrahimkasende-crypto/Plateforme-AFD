/**
 * Import contrôlé et idempotent des logos partenaires depuis l’ancien site afd-rdc.org.
 *
 * Usage :
 *   npx tsx scripts/import-partner-logos-from-legacy-site.ts --dry-run
 *   npx tsx scripts/import-partner-logos-from-legacy-site.ts
 *
 * Prérequis écriture Supabase :
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (serveur uniquement — jamais exposée au navigateur)
 *
 * Sans SERVICE_ROLE_KEY : télécharge / optimise localement uniquement.
 */

import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { LEGACY_PARTNERS } from "../src/config/legacy-partners";

const ROOT = path.resolve(__dirname, "..");
const BANK = path.join(
  process.env.HOME || process.env.USERPROFILE || "",
  "Documents",
  "Banque des images AFD",
  "08_Partenaires",
);
const ORIG_DIR = path.join(BANK, "00_Originaux");
const OPT_DIR = path.join(BANK, "01_Optimises");
const PUB_DIR = path.join(ROOT, "public", "images", "afd", "partenaires");

type LegacyRow = {
  id: string;
  name: string;
  logo_url: string | null;
  category: string | null;
  order: number | null;
  active: boolean | null;
};

type ReportLine = {
  name: string;
  action: string;
  detail?: string;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

async function ensureDirs() {
  for (const dir of [
    ORIG_DIR,
    OPT_DIR,
    path.join(BANK, "02_A_Identifier"),
    path.join(BANK, "03_Doublons"),
    path.join(BANK, "Metadata"),
    PUB_DIR,
  ]) {
    await fs.mkdir(dir, { recursive: true });
  }
}

function fromLocalConfig(): LegacyRow[] {
  return LEGACY_PARTNERS.map((p) => ({
    id: p.id,
    name: p.name,
    logo_url: p.sourceLogoUrl,
    category: p.category,
    order: p.order,
    active: true,
  }));
}

async function fetchLegacyPartners(): Promise<LegacyRow[]> {
  const legacyUrl = process.env.LEGACY_SUPABASE_URL;
  const legacyAnon = process.env.LEGACY_SUPABASE_ANON_KEY;
  if (!legacyUrl || !legacyAnon) {
    console.log(
      `Config locale utilisée (${LEGACY_PARTNERS.length} partenaires vérifiés).`,
    );
    return fromLocalConfig();
  }

  const endpoint = `${legacyUrl.replace(/\/$/, "")}/rest/v1/partenaires?select=*`;
  const res = await fetch(endpoint, {
    headers: {
      apikey: legacyAnon,
      Authorization: `Bearer ${legacyAnon}`,
    },
  });
  if (!res.ok) {
    console.warn(
      `API legacy indisponible (${res.status}) — fallback config locale.`,
    );
    return fromLocalConfig();
  }
  return (await res.json()) as LegacyRow[];
}

async function loadSharp() {
  try {
    return (await import("sharp")).default;
  } catch {
    throw new Error(
      "Le module `sharp` est requis pour l’optimisation. Installez-le ou exécutez scripts/optimize-partner-logos.mjs.",
    );
  }
}

async function download(url: string, dest: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Téléchargement échoué ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const mime = res.headers.get("content-type") || "";
  if (!mime.includes("image") && !url.match(/\.(png|jpe?g|svg|webp)(\?|$)/i)) {
    throw new Error(`Type MIME inattendu (${mime}) pour ${url}`);
  }
  try {
    await fs.access(dest);
    // Ne jamais écraser un original existant
  } catch {
    await fs.writeFile(dest, buf);
  }
  return buf;
}

async function optimizeToPng(srcBuf: Buffer, outPath: string, pubPath: string) {
  const sharp = await loadSharp();
  const meta = await sharp(srcBuf).metadata();
  const w = meta.width || 0;
  let pipeline = sharp(srcBuf);
  if (w > 1000) {
    pipeline = pipeline.resize({ width: 1000, withoutEnlargement: true });
  }
  const buf = await pipeline
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  await fs.writeFile(outPath, buf);
  await fs.writeFile(pubPath, buf);
  const outMeta = await sharp(buf).metadata();
  return {
    buf,
    width: outMeta.width ?? null,
    height: outMeta.height ?? null,
    hash: createHash("sha256").update(buf).digest("hex"),
  };
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const canWrite = Boolean(supabaseUrl && serviceKey) && !dryRun;

  console.log("=== Import logos partenaires (afd-rdc.org) ===");
  console.log(`Mode : ${dryRun ? "dry-run" : canWrite ? "écriture Supabase" : "local uniquement"}`);

  await ensureDirs();
  const rows = (await fetchLegacyPartners()).filter((r) => r.active !== false && r.logo_url);
  const report: ReportLine[] = [];
  const seenHashes = new Map<string, string>();

  const admin = canWrite
    ? createClient(supabaseUrl!, serviceKey!, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

  let created = 0;
  let updated = 0;
  let uploaded = 0;
  let duplicates = 0;

  for (const [index, row] of rows.entries()) {
    const slug = slugify(row.name);
    const ext = path.extname(new URL(row.logo_url!).pathname) || ".png";
    const originalName = `${String(index + 1).padStart(2, "0")}-${slug}${ext}`;
    const originalPath = path.join(ORIG_DIR, originalName);
    const optName = `${slug}.png`;
    const optPath = path.join(OPT_DIR, optName);
    const pubPath = path.join(PUB_DIR, optName);

    if (dryRun) {
      report.push({ name: row.name, action: "dry-run", detail: row.logo_url! });
      continue;
    }

    const raw = await download(row.logo_url!, originalPath);
    const rawHash = createHash("sha256").update(raw).digest("hex");
    if (seenHashes.has(rawHash)) {
      duplicates += 1;
      await fs.copyFile(
        originalPath,
        path.join(BANK, "03_Doublons", originalName),
      ).catch(() => undefined);
      report.push({
        name: row.name,
        action: "doublon",
        detail: `identique à ${seenHashes.get(rawHash)}`,
      });
      continue;
    }
    seenHashes.set(rawHash, row.name);

    const optimized = await optimizeToPng(raw, optPath, pubPath);
    const storagePath = `${row.id}/logo-principal.png`;
    let publicLogoUrl = `/images/afd/partenaires/${optName}`;
    let mediaId: string | null = null;

    if (admin) {
      const { error: upErr } = await admin.storage
        .from("partenaires")
        .upload(storagePath, optimized.buf, {
          contentType: "image/png",
          upsert: true,
        });
      if (upErr) {
        report.push({ name: row.name, action: "upload-error", detail: upErr.message });
      } else {
        uploaded += 1;
        const { data: pub } = admin.storage.from("partenaires").getPublicUrl(storagePath);
        publicLogoUrl = pub.publicUrl;

        const { data: existingMedia } = await admin
          .from("medias")
          .select("id")
          .eq("bucket", "partenaires")
          .eq("storage_path", storagePath)
          .maybeSingle();

        const mediaPayload = {
          bucket: "partenaires",
          storage_path: storagePath,
          filename: optName,
          original_filename: originalName,
          mime_type: "image/png",
          size_bytes: optimized.buf.length,
          width: optimized.width,
          height: optimized.height,
          alt_text: `Logo ${row.name}`,
          credit: "Import depuis afd-rdc.org",
          source_url: row.logo_url,
          visibility: "public",
          content_hash: optimized.hash,
          resource_type: "partenaire",
          resource_id: row.id,
        };

        if (existingMedia?.id) {
          await admin.from("medias").update(mediaPayload).eq("id", existingMedia.id);
          mediaId = existingMedia.id;
        } else {
          const { data: inserted } = await admin
            .from("medias")
            .insert(mediaPayload)
            .select("id")
            .single();
          mediaId = inserted?.id ?? null;
        }
      }

      const partnerPayload = {
        id: row.id,
        name: row.name,
        acronyme:
          row.name.length <= 12 && !/\s/.test(row.name) ? row.name : null,
        slug,
        logo_url: publicLogoUrl,
        logo_media_id: mediaId,
        category: row.category,
        order: row.order ?? index + 1,
        active: true,
        publie: true,
        description: null,
        website_url: null,
        source_url: "https://afd-rdc.org/",
        source_imported_at: new Date().toISOString(),
        deleted_at: null,
        updated_at: new Date().toISOString(),
      };

      const { data: existing } = await admin
        .from("partenaires")
        .select("id")
        .eq("id", row.id)
        .maybeSingle();

      if (existing) {
        await admin.from("partenaires").update(partnerPayload).eq("id", row.id);
        updated += 1;
        report.push({ name: row.name, action: "updated", detail: publicLogoUrl });
      } else {
        await admin.from("partenaires").insert(partnerPayload);
        created += 1;
        report.push({ name: row.name, action: "created", detail: publicLogoUrl });
      }
    } else {
      report.push({
        name: row.name,
        action: "local-optimized",
        detail: pubPath,
      });
    }
  }

  const reportPath = path.join(ROOT, "docs", "PARTNERS_IMPORT_RUN_REPORT.md");
  const md = [
    "# Rapport d’exécution — import partenaires",
    "",
    `Date : ${new Date().toISOString()}`,
    `Partenaires traités : ${rows.length}`,
    `Créés : ${created}`,
    `Mis à jour : ${updated}`,
    `Upload Storage : ${uploaded}`,
    `Doublons : ${duplicates}`,
    "",
    "| Partenaire | Action | Détail |",
    "|---|---|---|",
    ...report.map((r) => `| ${r.name} | ${r.action} | ${r.detail ?? ""} |`),
    "",
  ].join("\n");
  await fs.writeFile(reportPath, md, "utf8");

  console.log(`Traités : ${rows.length}`);
  console.log(`Créés : ${created} | Mis à jour : ${updated} | Uploadés : ${uploaded} | Doublons : ${duplicates}`);
  console.log(`Rapport : ${reportPath}`);
  if (!canWrite && !dryRun) {
    console.log(
      "Astuce : définissez SUPABASE_SERVICE_ROLE_KEY pour uploader vers le bucket `partenaires`.",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
