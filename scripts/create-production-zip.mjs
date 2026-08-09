/**
 * Génère Deploy/Plateforme-AFD-Production.zip (racine = package.json).
 * Usage: node scripts/create-production-zip.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const deployDir = path.join(root, "Deploy");
const stageDir = path.join(deployDir, "_stage");
const zipPath = path.join(deployDir, "Plateforme-AFD-Production.zip");
const reportPath = path.join(deployDir, "DEPLOY_REPORT.md");

const EXCLUDE_DIR_NAMES = new Set([
  ".git",
  ".github",
  ".cursor",
  ".vscode",
  ".next",
  "node_modules",
  "coverage",
  "playwright-report",
  "test-results",
  "tmp",
  "logs",
  "Deploy",
  "tests",
  "docs",
  "scripts", // seeds / outils locaux — pas nécessaires au build Hostinger
  // Ne PAS exclure « supabase » ici : ça supprimerait aussi src/lib/supabase/*
  ".turbo",
  ".husky",
  "agent-transcripts",
  "production-backups",
  ".codex-logs",
]);

/** Dossiers media lourds déjà sur Supabase Storage (afd-media) — hors ZIP Hostinger. */
const EXCLUDE_PATH_PREFIXES = [
  "supabase/", // migrations SQL racine uniquement (PAS src/lib/supabase)
  "public/documents/",
  "public/assets/Banque des images AFD",
  "public/assets/Banque des images AFD - Classees",
  "public/assets/home/",
  "public/assets/programmes/",
  "public/images/afd/home/",
  "public/images/afd/Domaines/",
  "public/images/afd/impact/",
  "public/images/afd/actualites/",
  "public/images/afd/actions/",
  "public/images/afd/projets/",
  "public/images/afd/programmes/",
];

/** Fichiers isolés trop lourds / doublons / artefacts locaux. */
const EXCLUDE_EXACT_FILES = new Set([
  "Plateforme-AFD-Production.zip",
  "hostinger.env",
  "Fiche-Projet-AFD-Academie-Femmes-Kinshasa.docx",
  "public/assets/home/presentation-afd.png",
  "public/assets/home/presentation_afd.png",
  "public/assets/home/Femmes_AFD.png",
  "public/assets/programmes/programme-1.jpg",
  "public/assets/programmes/programme-2.jpg",
  "public/assets/programmes/programme-4.jpg",
]);

/** Toujours garder (même si > seuil). */
const KEEP_PUBLIC_PREFIXES = [
  "public/assets/brand/",
  "public/brand/",
  "public/images/afd/partenaires/",
  "public/maps/",
  "public/icon",
  "public/favicon",
];

/** Seuil strict pour Hostinger (upload). Hors keep-list. */
const MAX_PUBLIC_MEDIA_BYTES = 250 * 1024;

const EXCLUDE_FILE_NAMES = new Set([
  ".env",
  ".env.local",
  ".env.production",
  ".env.development",
  ".env.test",
  ".DS_Store",
  "Thumbs.db",
  "tsconfig.tsbuildinfo",
  "playwright.config.ts",
  "vitest.config.ts",
  "hostinger.env",
]);

const EXCLUDE_EXTENSIONS = new Set([
  ".log",
  ".cache",
  ".tmp",
  ".bak",
  ".old",
  ".zip",
  ".docx",
  ".pdf",
  ".mp4",
  ".mov",
  ".avi",
  ".psd",
  ".ai",
]);

function shouldSkip(relPosix, isDir, absPath = null) {
  const parts = relPosix.split("/");
  if (parts.some((p) => EXCLUDE_DIR_NAMES.has(p))) return true;
  if (parts.includes(".temp")) return true;
  // Banque d'images → Supabase Storage (afd-media), pas dans le ZIP
  if (/banque des images afd/i.test(relPosix)) return true;
  if (EXCLUDE_PATH_PREFIXES.some((p) => relPosix === p.slice(0, -1) || relPosix.startsWith(p))) {
    return true;
  }
  if (EXCLUDE_EXACT_FILES.has(relPosix)) return true;
  const base = parts[parts.length - 1] || "";
  if (!isDir) {
    if (EXCLUDE_FILE_NAMES.has(base)) return true;
    if (base.startsWith(".env.") && base !== ".env.example") return true;
    if (/^Plateforme-AFD-.*\.zip$/i.test(base)) return true;
    if (/^Fiche-Projet-.*\.(docx|pdf)$/i.test(base)) return true;
    const ext = path.extname(base).toLowerCase();
    if (EXCLUDE_EXTENSIONS.has(ext)) return true;
    const keepAlways = KEEP_PUBLIC_PREFIXES.some((p) => relPosix.startsWith(p));
    if (
      !keepAlways &&
      relPosix.startsWith("public/") &&
      [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".pdf"].includes(ext) &&
      absPath &&
      fs.existsSync(absPath) &&
      fs.statSync(absPath).size > MAX_PUBLIC_MEDIA_BYTES
    ) {
      return true;
    }
    // Tout fichier hors keep-list > 1.5 Mo exclu (sécurité)
    if (
      !keepAlways &&
      absPath &&
      fs.existsSync(absPath) &&
      fs.statSync(absPath).size > 1.5 * 1024 * 1024
    ) {
      return true;
    }
  }
  return false;
}

function copyTree(from, to, rel = "") {
  fs.mkdirSync(to, { recursive: true });
  let count = 0;
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const name = entry.name;
    const relChild = rel ? `${rel}/${name}` : name;
    const src = path.join(from, name);
    const relNorm = relChild.replace(/\\/g, "/");
    if (shouldSkip(relNorm, entry.isDirectory(), src)) continue;
    const dest = path.join(to, name);
    if (entry.isDirectory()) {
      count += copyTree(src, dest, relChild);
    } else if (entry.isFile()) {
      fs.copyFileSync(src, dest);
      count += 1;
    }
  }
  return count;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function readPkg() {
  return JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
}

function main() {
  fs.mkdirSync(deployDir, { recursive: true });
  fs.rmSync(stageDir, { recursive: true, force: true });
  fs.rmSync(zipPath, { force: true });
  fs.mkdirSync(stageDir, { recursive: true });

  const fileCount = copyTree(root, stageDir);
  if (!fs.existsSync(path.join(stageDir, "package.json"))) {
    throw new Error("package.json manquant à la racine du stage");
  }
  if (!fs.existsSync(path.join(stageDir, "src"))) {
    throw new Error("src/ manquant dans le stage");
  }
  if (fs.existsSync(path.join(stageDir, ".env.local"))) {
    throw new Error(".env.local ne doit pas être dans le ZIP");
  }

  const withDemo = /^(1|true|yes)$/i.test(
    String(process.env.AFD_DEPLOY_WITH_DEMO || ""),
  );
  const demoFlag = withDemo ? "true" : "false";

  // Guide Hostinger (sans secrets) inclus dans le ZIP
  fs.writeFileSync(
    path.join(stageDir, "HOSTINGER_ENV.txt"),
    `Plateforme-AFD — variables Hostinger (à saisir dans le panneau, PAS dans le ZIP)

OBLIGATOIRES (images / auth cassés si mauvais projet Supabase)
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=https://afd-rdc.org
NEXT_PUBLIC_SUPABASE_URL=https://mxxuxnoqnwjygawvvhcb.supabase.co
  !! NE PAS utiliser un autre projet (ex. qsyvkaxlwxbhuphvctpl) — les images Storage échouent.
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (clé du projet mxxuxnoqnwjygawvvhcb)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_... (même projet)
NEXT_PUBLIC_APP_NAME=Plateforme-AFD
NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA=${demoFlag}
NEXT_PUBLIC_ENABLE_DEMO_CONTENT=${demoFlag}
${withDemo ? "\n!! MODE DÉMO CLIENT : carte RDC bleue + données de présentation.\n!! Remettre à false après la démo client.\n" : ""}

OBLIGATOIRE POUR INVITATIONS / ADMIN COMPTES
SUPABASE_SERVICE_ROLE_KEY=eyJ...service_role...
(JAMAIS NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)

OPTIONNEL
NEWSLETTER_SEND_ENABLED=false
SERDIPAY_ENABLED=false
OCR_CLOUD_ENABLED=false
OCR_PROVIDER=native
OCR_ORGANISATION_ID=afd-asbl

MESSAGERIE (Phase 1 = webmail)
MAIL_WEBMAIL_URL=https://…
MAIL_IMAP_HOST=afd-rdc.org
MAIL_IMAP_PORT=993
MAIL_IMAP_SECURE=true
MAIL_SMTP_HOST=afd-rdc.org
MAIL_SMTP_PORT=587
MAIL_SMTP_SECURE=false
MAIL_INTEGRATED_ENABLED=false
CYBERPANEL_PANEL_URL=https://panel.afd-rdc.org:8090

Après ajout/modif des variables Hostinger → redéployer.
`,
    "utf8",
  );


  // Compress via tar — lister les entrées racine (PAS ".") pour éviter le préfixe "./"
  // qui fait échouer la détection Hostinger (« Framework non pris en charge »).
  const topEntries = fs
    .readdirSync(stageDir, { withFileTypes: true })
    .map((e) => e.name)
    .filter((name) => name !== "." && name !== "..");
  if (!topEntries.includes("package.json")) {
    throw new Error("package.json absent des entrées racine du stage");
  }
  execFileSync("tar", ["-a", "-c", "-f", zipPath, "-C", stageDir, ...topEntries], {
    stdio: "inherit",
  });

  // Vérifie que package.json est bien à la racine du ZIP (sans préfixe "./")
  const zipListing = execFileSync("tar", ["-tf", zipPath], {
    encoding: "utf8",
  });
  const zipLines = zipListing
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const hasRootPkg = zipLines.includes("package.json");
  const hasDotSlashPkg = zipLines.includes("./package.json");
  if (!hasRootPkg || hasDotSlashPkg) {
    throw new Error(
      `ZIP invalide pour Hostinger : package.json doit être à la racine sans "./" (root=${hasRootPkg}, dotSlash=${hasDotSlashPkg})`,
    );
  }
  if (!zipLines.some((l) => l === "src/" || l.startsWith("src/"))) {
    throw new Error("ZIP invalide : dossier src/ manquant");
  }
  const requiredSupabaseModules = [
    "src/lib/supabase/admin-service.ts",
    "src/lib/supabase/client.ts",
    "src/lib/supabase/env.ts",
    "src/lib/supabase/safe.ts",
    "src/lib/supabase/server.ts",
  ];
  for (const required of requiredSupabaseModules) {
    if (!zipLines.includes(required)) {
      throw new Error(`ZIP invalide : module critique manquant (${required})`);
    }
  }

  const zipStat = fs.statSync(zipPath);
  const sha256 = createHash("sha256")
    .update(fs.readFileSync(zipPath))
    .digest("hex");
  const pkg = readPkg();
  const nodeVersion = process.version;
  const generatedAt = new Date().toISOString();

  // Scan rapide stage déjà nettoyé : absence .env.local / node_modules
  const forbidden = [".env.local", "node_modules", ".next", ".git"];
  for (const name of forbidden) {
    if (fs.existsSync(path.join(stageDir, name))) {
      throw new Error(`Fichier interdit encore présent dans le stage : ${name}`);
    }
  }

  const report = `# Rapport de déploiement — Plateforme-AFD

## Artefact

| Champ | Valeur |
|-------|--------|
| Fichier | \`Deploy/Plateforme-AFD-Production.zip\` |
| Chemin absolu | \`${zipPath.replace(/\\/g, "/")}\` |
| Fichiers inclus (stage) | ${fileCount} |
| Taille ZIP | ${formatBytes(zipStat.size)} (${zipStat.size} octets) |
| SHA-256 | \`${sha256}\` |
| Date de génération | ${generatedAt} |
| Structure ZIP | \`package.json\` à la **racine** |

## Versions

| Composant | Version |
|-----------|---------|
| Node (machine build) | ${nodeVersion} |
| Node Hostinger conseillé | 22.x |
| Next.js | ${pkg.dependencies?.next ?? "—"} |
| React | ${pkg.dependencies?.react ?? "—"} |
| package.json version | ${pkg.version} |

## Variables Hostinger (sans secrets)

Obligatoires :

\`\`\`env
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=https://afd-rdc.org
NEXT_PUBLIC_SUPABASE_URL=https://mxxuxnoqnwjygawvvhcb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
# ou NEXT_PUBLIC_SUPABASE_ANON_KEY=
# IMPORTANT: projet = mxxuxnoqnwjygawvvhcb uniquement (pas un autre ref)
NEXT_PUBLIC_APP_NAME=Plateforme-AFD
NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA=${demoFlag}
NEXT_PUBLIC_ENABLE_DEMO_CONTENT=${demoFlag}
SUPABASE_SERVICE_ROLE_KEY=
\`\`\`
${withDemo ? "\n**Mode démo activé** (`AFD_DEPLOY_WITH_DEMO=1`) — carte RDC bleue / contenu présentation.\n" : ""}

Messagerie Phase 1 :

\`\`\`env
MAIL_WEBMAIL_URL=
MAIL_IMAP_HOST=afd-rdc.org
MAIL_IMAP_PORT=993
MAIL_IMAP_SECURE=true
MAIL_SMTP_HOST=afd-rdc.org
MAIL_SMTP_PORT=587
MAIL_SMTP_SECURE=false
MAIL_INTEGRATED_ENABLED=false
CYBERPANEL_PANEL_URL=https://panel.afd-rdc.org:8090
\`\`\`

## Configuration Hostinger

\`\`\`text
Type : Node.js Web App
Source : Upload ZIP
Préréglage framework : Next.js (manuel si non détecté)
Version Node : 22.x (ou 24.x)
Répertoire racine : ./
Gestionnaire : npm
Commande d'installation : npm ci
Commande de construction : npm run build
Commande de démarrage : npm run start
Répertoire de sortie : .next
\`\`\`

**Important :** à l'extraction, \`package.json\` doit être visible immédiatement (pas dans un sous-dossier).

## Exclusions (ZIP léger Hostinger)

\`.git\`, \`.next\`, \`node_modules\`, \`tests\`, \`docs\`, \`scripts\`, \`supabase\`, \`Deploy\`, \`.env*\`, banque d’images, héros/home/programmes locaux, PDF/DOCX/ZIP, médias \`public/\` > 250 Ko (hors brand / logos partenaires / maps). Images via **Supabase Storage** (\`afd-media\`).

## Checklist

1. [ ] ZIP téléversé
2. [ ] \`package.json\` à la racine
3. [ ] Variables Hostinger renseignées (pas dans le ZIP)
4. [ ] \`MAIL_INTEGRATED_ENABLED=false\`
5. [ ] Build Hostinger OK
6. [ ] Tester /, /connexion, /admin, /bibliotheque, /admin/messagerie
`;

  fs.writeFileSync(reportPath, report, "utf8");
  fs.rmSync(stageDir, { recursive: true, force: true });

  console.log(`ZIP_OK ${zipPath}`);
  console.log(`FILES=${fileCount}`);
  console.log(`SIZE=${zipStat.size}`);
  console.log(`SHA256=${sha256}`);
  console.log(`REPORT=${reportPath}`);
}

main();
