/**
 * Inventaire + sélection + optimisation WebP (originaux intacts).
 * Source : C:\Users\IKAS\Documents\Banque des images AFD\00_Originales
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const BANK = path.join(
  process.env.USERPROFILE ?? "C:\\Users\\IKAS",
  "Documents",
  "Banque des images AFD",
);
const ORIGINALS = path.join(BANK, "00_Originales");
const OPTIMIZED = path.join(BANK, "12_Optimisees-Web");
const PROJECT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
// Windows path fix for file URL
const ROOT = process.cwd();
const PUBLIC_AFD = path.join(ROOT, "public", "images", "afd");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

function hashFile(file) {
  const buf = fs.readFileSync(file);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyPreserve(src, destDir) {
  ensureDir(destDir);
  const dest = path.join(destDir, path.basename(src));
  if (!fs.existsSync(dest)) fs.copyFileSync(src, dest);
  return dest;
}

async function meta(file) {
  const stat = fs.statSync(file);
  let width = 0;
  let height = 0;
  try {
    const info = await sharp(file).metadata();
    width = info.width ?? 0;
    height = info.height ?? 0;
  } catch {
    /* ignore */
  }
  return {
    fichier_original: path.basename(file),
    chemin_original: file,
    largeur: width,
    hauteur: height,
    orientation: width >= height ? "paysage" : "portrait",
    taille: stat.size,
    date_fichier: stat.mtime.toISOString(),
    hash: hashFile(file),
  };
}

async function toWebp(src, dest, { width, height, quality = 82 }) {
  ensureDir(path.dirname(dest));
  let pipeline = sharp(src).rotate();
  if (width || height) {
    pipeline = pipeline.resize({
      width,
      height,
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  await pipeline.webp({ quality }).toFile(dest);
  return dest;
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

async function main() {
  ensureDir(OPTIMIZED);
  ensureDir(PUBLIC_AFD);

  const files = walk(ORIGINALS);
  const rows = [];
  const hashMap = new Map();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const m = await meta(file);
    const prev = hashMap.get(m.hash);
    const doublon = Boolean(prev);
    if (!prev) hashMap.set(m.hash, file);

    const name = m.fichier_original.toLowerCase();
    let categorie = "11_Non-classees";
    let section = "non_classee";
    let autorisation = "oui";
    let enfants = "inconnu";
    let personnes = "possible";
    let description = "Photographie AFD — contenu à confirmer visuellement.";

    if (name.includes("logo")) {
      categorie = "08_Partenaires";
      section = "logo";
      personnes = "non";
      description = "Logo ou icône institutionnelle AFD.";
      autorisation = "non";
    } else if (name.includes("maquette")) {
      categorie = "11_Non-classees";
      section = "maquette";
      description = "Capture de maquette UI — non utilisée comme photo terrain.";
      personnes = "non";
      autorisation = "non";
    } else if (name.includes("equipe") || name.includes("coordonatrice")) {
      categorie = "07_Equipe";
      section = "equipe";
      description = "Photographie d’équipe ou de coordination AFD.";
      autorisation = "a_verifier";
    } else if (name.includes("beneficiaire")) {
      categorie = "10_Images-a-valider";
      section = "a_valider";
      description = "Personnes potentiellement bénéficiaires — autorisation à vérifier.";
      enfants = "possible";
      autorisation = "a_verifier";
    } else if (name.includes("femme") || name.includes("resilient")) {
      categorie = "03_Actions-sur-le-terrain";
      section = "actions_terrain";
      description = "Groupe de femmes / scène communautaire.";
      autorisation = "a_verifier";
    } else {
      categorie = "11_Non-classees";
      section = "a_trier";
      description = "Image issue des téléchargements locaux — classement à affiner.";
      autorisation = "a_verifier";
    }

    // Copy into category folder (never move originals)
    const catDir = path.join(BANK, categorie.split("/")[0] === categorie ? categorie : categorie);
    copyPreserve(file, path.join(BANK, categorie));

    rows.push({
      id: `img_${String(i + 1).padStart(3, "0")}`,
      ...m,
      categorie,
      sous_categorie: "",
      description_visuelle: description,
      personnes_identifiables: personnes,
      enfants_visibles: enfants,
      logo_afd_visible: name.includes("logo") || name.includes("afd") ? "possible" : "inconnu",
      section_recommandee: section,
      autorisation_a_verifier: autorisation === "a_verifier" ? "oui" : "non",
      qualite: m.largeur >= 1200 ? "bonne" : m.largeur >= 600 ? "moyenne" : "faible",
      doublon: doublon ? "oui" : "non",
      selectionnee: "non",
      chemin_web: "",
      notes: doublon ? `Doublon de ${prev}` : "",
    });
  }

  // Selections from known good local photos (Maquette_AFD)
  const pick = (namePart) =>
    files.find((f) => path.basename(f).toLowerCase().includes(namePart));

  const selections = [
    {
      key: "hero",
      src: pick("equipe_2") ?? pick("beneficiaire1"),
      destBank: path.join(OPTIMIZED, "hero-afd.webp"),
      destPublic: path.join(PUBLIC_AFD, "home", "hero-afd.webp"),
      width: 1920,
      height: 1080,
      mark: "01_Accueil-Hero",
    },
    {
      key: "prog1",
      src: pick("beneficiaire1"),
      destBank: path.join(OPTIMIZED, "autonomisation-economique.webp"),
      destPublic: path.join(PUBLIC_AFD, "programmes", "autonomisation-economique.webp"),
      width: 1200,
      height: 750,
      mark: "02_Programmes/Autonomisation-economique",
    },
    {
      key: "prog2",
      src: pick("beneficiaire2"),
      destBank: path.join(OPTIMIZED, "sante-nutrition.webp"),
      destPublic: path.join(PUBLIC_AFD, "programmes", "sante-nutrition.webp"),
      width: 1200,
      height: 750,
      mark: "02_Programmes/Sante-Nutrition",
    },
    {
      key: "prog3",
      src: pick("images_femmes") ?? pick("resilient"),
      destBank: path.join(OPTIMIZED, "wash.webp"),
      destPublic: path.join(PUBLIC_AFD, "programmes", "wash.webp"),
      width: 1200,
      height: 750,
      mark: "02_Programmes/WASH",
    },
    {
      key: "prog4",
      src: pick("equipe_afd") ?? pick("coordonatrice"),
      destBank: path.join(OPTIMIZED, "protection-droits-femmes.webp"),
      destPublic: path.join(PUBLIC_AFD, "programmes", "protection-droits-femmes.webp"),
      width: 1200,
      height: 750,
      mark: "02_Programmes/Protection-VBG",
    },
    {
      key: "action1",
      src: pick("beneficiaire1"),
      destBank: path.join(OPTIMIZED, "action-terrain-01.webp"),
      destPublic: path.join(PUBLIC_AFD, "actions-terrain", "action-terrain-01.webp"),
      width: 1400,
      height: 900,
      mark: "03_Actions-sur-le-terrain",
    },
    {
      key: "action2",
      src: pick("beneficiaire2"),
      destBank: path.join(OPTIMIZED, "action-terrain-02.webp"),
      destPublic: path.join(PUBLIC_AFD, "actions-terrain", "action-terrain-02.webp"),
      width: 1400,
      height: 900,
      mark: "03_Actions-sur-le-terrain",
    },
    {
      key: "action3",
      src: pick("equipe_2"),
      destBank: path.join(OPTIMIZED, "action-terrain-03.webp"),
      destPublic: path.join(PUBLIC_AFD, "actions-terrain", "action-terrain-03.webp"),
      width: 1400,
      height: 900,
      mark: "03_Actions-sur-le-terrain",
    },
    {
      key: "news1",
      src: pick("beneficiaire1"),
      destBank: path.join(OPTIMIZED, "actualite-01.webp"),
      destPublic: path.join(PUBLIC_AFD, "actualites", "actualite-01.webp"),
      width: 1000,
      height: 650,
      mark: "05_Actualites",
    },
    {
      key: "news2",
      src: pick("beneficiaire2"),
      destBank: path.join(OPTIMIZED, "actualite-02.webp"),
      destPublic: path.join(PUBLIC_AFD, "actualites", "actualite-02.webp"),
      width: 1000,
      height: 650,
      mark: "05_Actualites",
    },
    {
      key: "news3",
      src: pick("equipe_2"),
      destBank: path.join(OPTIMIZED, "actualite-03.webp"),
      destPublic: path.join(PUBLIC_AFD, "actualites", "actualite-03.webp"),
      width: 1000,
      height: 650,
      mark: "05_Actualites",
    },
    {
      key: "impact",
      src: pick("images_femmes") ?? pick("beneficiaire1"),
      destBank: path.join(OPTIMIZED, "histoire-principale.webp"),
      destPublic: path.join(PUBLIC_AFD, "impact", "histoire-principale.webp"),
      width: 1000,
      height: 1200,
      mark: "06_Histoires-impact",
    },
  ];

  const selectedPaths = [];
  for (const item of selections) {
    if (!item.src) {
      console.warn("SKIP missing source for", item.key);
      continue;
    }
    copyPreserve(item.src, path.join(BANK, item.mark.split("/")[0], ...(item.mark.includes("/") ? [item.mark.split("/")[1]] : [])));
    await toWebp(item.src, item.destBank, {
      width: item.width,
      height: item.height,
    });
    await toWebp(item.src, item.destPublic, {
      width: item.width,
      height: item.height,
    });
    selectedPaths.push(item.destPublic);
    const row = rows.find((r) => r.chemin_original === item.src);
    if (row) {
      row.selectionnee = "oui";
      row.chemin_web = item.destPublic.replace(ROOT, "").replace(/\\/g, "/");
      row.section_recommandee = item.key;
    }
  }

  const headers = [
    "id",
    "fichier_original",
    "chemin_original",
    "largeur",
    "hauteur",
    "orientation",
    "categorie",
    "sous_categorie",
    "description_visuelle",
    "personnes_identifiables",
    "enfants_visibles",
    "logo_afd_visible",
    "section_recommandee",
    "autorisation_a_verifier",
    "qualite",
    "doublon",
    "selectionnee",
    "chemin_web",
    "notes",
  ];

  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(",")),
  ].join("\n");

  fs.writeFileSync(path.join(BANK, "inventaire-images.csv"), csv, "utf8");

  const duplicates = rows.filter((r) => r.doublon === "oui").length;
  const toReview = rows.filter((r) => r.autorisation_a_verifier === "oui").length;
  const selected = rows.filter((r) => r.selectionnee === "oui").length;

  console.log(
    JSON.stringify(
      {
        total: rows.length,
        duplicates,
        toReview,
        selected,
        webFiles: selectedPaths.length,
        bank: BANK,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
