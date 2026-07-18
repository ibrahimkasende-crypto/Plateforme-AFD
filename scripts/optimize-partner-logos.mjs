import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const bank = path.join(
  "C:",
  "Users",
  "IKAS",
  "Documents",
  "Banque des images AFD",
  "08_Partenaires",
);
const origDir = path.join(bank, "00_Originaux");
const optDir = path.join(bank, "01_Optimises");
const pubDir = path.join(ROOT, "public", "images", "afd", "partenaires");

fs.mkdirSync(optDir, { recursive: true });
fs.mkdirSync(pubDir, { recursive: true });
fs.mkdirSync(path.join(bank, "Metadata"), { recursive: true });

const invPath = path.join(ROOT, "tmp-partners-inventory.json");
const invRaw = fs.readFileSync(invPath, "utf8").replace(/^\uFEFF/, "");
const inv = JSON.parse(invRaw);
const report = [];

for (const p of inv) {
  const src = path.join(origDir, p.fichier_original);
  const meta = await sharp(src).metadata();
  const w = meta.width || 0;
  const h = meta.height || 0;
  const outName = `${p.slug}.png`;
  const resizeOpt =
    w > 1000
      ? { width: 1000, withoutEnlargement: true }
      : undefined;
  const pipeline = sharp(src);
  if (resizeOpt) pipeline.resize(resizeOpt);
  const buf = await pipeline
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  const outMeta = await sharp(buf).metadata();
  fs.writeFileSync(path.join(optDir, outName), buf);
  fs.writeFileSync(path.join(pubDir, outName), buf);
  const hash = crypto.createHash("sha256").update(buf).digest("hex");
  p.chemin_optimise = outName;
  p.largeur = String(outMeta.width || "");
  p.hauteur = String(outMeta.height || "");
  p.taille_optimisee = buf.length;
  p.largeur_orig = w;
  p.hauteur_orig = h;
  p.sha256_optimise = hash;
  report.push({
    name: p.nom_partenaire,
    file: outName,
    orig: `${w}x${h}/${p.taille_octets}`,
    opt: `${outMeta.width}x${outMeta.height}/${buf.length}`,
  });
  console.log(
    "OPT",
    outName,
    `${w}x${h}`,
    "->",
    `${outMeta.width}x${outMeta.height}`,
    buf.length,
  );
}

fs.writeFileSync(invPath, JSON.stringify(inv, null, 2));

const cols = [
  "id",
  "nom_partenaire",
  "acronyme",
  "fichier_original",
  "url_source_logo",
  "url_partenaire",
  "format",
  "largeur",
  "hauteur",
  "taille_octets",
  "fond_transparent",
  "variante",
  "doublon",
  "identifie",
  "selectionne",
  "chemin_optimise",
  "chemin_supabase",
  "notes",
];

function csvEscape(value) {
  const v = String(value ?? "");
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

const csv = [
  cols.join(","),
  ...inv.map((row) => cols.map((c) => csvEscape(row[c])).join(",")),
].join("\n");

fs.writeFileSync(path.join(bank, "inventaire-partenaires.csv"), csv, "utf8");
fs.writeFileSync(
  path.join(bank, "Metadata", "optimisation-report.json"),
  JSON.stringify(report, null, 2),
);
console.log("DONE", report.length);
