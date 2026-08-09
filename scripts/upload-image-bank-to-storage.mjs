/**
 * Upload de la banque d'images locale vers Supabase Storage (bucket afd-media).
 *
 * Usage:
 *   node scripts/upload-image-bank-to-storage.mjs
 *
 * Requis dans .env.local :
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (non vide)
 *
 * Chemin Storage :
 *   afd-media/banque/{dossier}/{fichier}
 *
 * URL publique :
 *   {SUPABASE_URL}/storage/v1/object/public/afd-media/banque/...
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const BANK_DIR = path.join(
  root,
  "public",
  "assets",
  "Banque des images AFD - Classees",
);
const BUCKET = "afd-media";
const STORAGE_PREFIX = "banque";

function loadEnv() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) {
    throw new Error(".env.local introuvable");
  }
  const text = fs.readFileSync(envPath, "utf8");
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".pdf") return "application/pdf";
  return "image/jpeg";
}

/** Chemins Storage sans accents / caractères spéciaux. */
function sanitizeSegment(segment) {
  return segment
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function toStorageRel(rel) {
  return rel
    .split("/")
    .filter(Boolean)
    .map(sanitizeSegment)
    .join("/");
}

async function uploadWithRetry(supabase, storagePath, body, type, attempts = 6) {
  let lastError = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const { error } = await supabase.storage.from(BUCKET).upload(storagePath, body, {
        contentType: type,
        upsert: true,
        cacheControl: "31536000",
      });
      if (!error) return null;
      lastError = error;
    } catch (error) {
      lastError = error;
    }
    await sleep(1000 * (i + 1));
  }
  return lastError;
}

function listFiles(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listFiles(full, base));
    } else if (/\.(jpe?g|png|webp|gif)$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function withNetworkRetry(label, fn, attempts = 5) {
  let lastError = null;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const msg = error?.message || String(error);
      console.warn(`${label} retry ${i + 1}/${attempts}: ${msg}`);
      await sleep(1000 * (i + 1));
    }
  }
  throw lastError ?? new Error(`${label} failed`);
}

async function ensureBucket(supabase) {
  await withNetworkRetry("ENSURE_BUCKET", async () => {
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();
    if (listError) throw listError;

    const exists = (buckets ?? []).some(
      (b) => b.id === BUCKET || b.name === BUCKET,
    );
    if (exists) {
      const { error: updateError } = await supabase.storage.updateBucket(
        BUCKET,
        {
          public: true,
          fileSizeLimit: 15 * 1024 * 1024,
          allowedMimeTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "application/pdf",
          ],
        },
      );
      if (updateError && !/not found/i.test(updateError.message)) {
        // Bucket déjà public : non bloquant
        console.warn("UPDATE_BUCKET_WARN", updateError.message);
      }
      return;
    }

    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 15 * 1024 * 1024,
      allowedMimeTypes: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "application/pdf",
      ],
    });
    if (error && !/already exists/i.test(error.message)) {
      throw error;
    }
  });
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL manquant");
  if (!key || key.length < 20) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY vide ou invalide dans .env.local — collez la clé service_role Supabase.",
    );
  }
  if (!fs.existsSync(BANK_DIR)) {
    throw new Error(`Dossier banque introuvable: ${BANK_DIR}`);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("ENSURE_BUCKET", BUCKET);
  await ensureBucket(supabase);

  const files = listFiles(BANK_DIR);
  console.log(`FILES_TO_UPLOAD=${files.length}`);

  let ok = 0;
  let fail = 0;
  const concurrency = 2;
  let index = 0;

  async function worker() {
    while (index < files.length) {
      const i = index++;
      const full = files[i];
      const rel = path.relative(BANK_DIR, full).split(path.sep).join("/");
      const storageRel = toStorageRel(rel);
      const storagePath = `${STORAGE_PREFIX}/${storageRel}`;
      const publicUrl = `${url.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/${storagePath
        .split("/")
        .map((s) => encodeURIComponent(s))
        .join("/")}`;

      try {
        const head = await fetch(publicUrl, { method: "HEAD" });
        if (head.ok) {
          ok += 1;
          if (ok % 25 === 0 || ok + fail === files.length) {
            console.log(`PROGRESS ok=${ok} fail=${fail} / ${files.length} (skip existing)`);
          }
          continue;
        }
      } catch {
        // continuer upload
      }

      const body = fs.readFileSync(full);
      const error = await uploadWithRetry(
        supabase,
        storagePath,
        body,
        contentType(full),
      );
      if (error) {
        fail += 1;
        console.error(`FAIL ${rel}: ${error.message}`);
      } else {
        ok += 1;
        if (ok % 25 === 0 || ok + fail === files.length) {
          console.log(`PROGRESS ok=${ok} fail=${fail} / ${files.length}`);
        }
      }
    }
  }

  await Promise.all(
    Array.from({ length: concurrency }, () => worker()),
  );

  // Mettre à jour les URLs en base si la table existe
  const publicBase = `${url.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/${STORAGE_PREFIX}`;

  const { data: images, error: selectError } = await supabase
    .from("bibliotheque_images")
    .select("id, local_asset_path, public_url")
    .limit(5000);

  if (!selectError && images) {
    let updated = 0;
    for (const row of images) {
      const local = row.local_asset_path || "";
      const marker = "Banque des images AFD - Classees/";
      const idx = local.indexOf(marker);
      if (idx === -1) continue;
      const rel = local.slice(idx + marker.length);
      const storageRel = toStorageRel(rel);
      const publicUrl = `${publicBase}/${storageRel
        .split("/")
        .map((s) => encodeURIComponent(s))
        .join("/")}`;
      if (row.public_url === publicUrl) continue;
      const { error: upErr } = await supabase
        .from("bibliotheque_images")
        .update({
          public_url: publicUrl,
          storage_bucket: BUCKET,
          storage_path: `${STORAGE_PREFIX}/${storageRel}`,
        })
        .eq("id", row.id);
      if (!upErr) updated += 1;
    }
    console.log(`DB_IMAGES_UPDATED=${updated}`);
  } else if (selectError) {
    console.log(`DB_SKIP=${selectError.message}`);
  }

  console.log(`DONE ok=${ok} fail=${fail}`);
  console.log(`PUBLIC_BASE=${publicBase}`);
  if (fail > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error("UPLOAD_FAIL", error.message || error);
  process.exit(1);
});
