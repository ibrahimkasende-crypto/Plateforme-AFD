/**
 * Génère Deploy/hostinger.env à partir de .env.local / .env.production
 * pour import Hostinger. N’affiche jamais les secrets dans la console.
 *
 * Usage : node scripts/export-hostinger-env.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(file) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) return {};
  const out = {};
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i <= 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

const local = { ...loadEnvFile(".env.production"), ...loadEnvFile(".env.local") };

function pick(key, fallback = "") {
  const v = local[key];
  return v != null && String(v).trim() !== "" ? String(v).trim() : fallback;
}

const lines = [
  "# Plateforme-AFD — import Hostinger (Environment Variables)",
  "# Projet Supabase : mxxuxnoqnwjygawvvhcb",
  "# Après import → Redeploy / Rebuild obligatoire",
  "",
  "NEXT_PUBLIC_APP_ENV=production",
  "NEXT_PUBLIC_SITE_URL=https://afd-rdc.org",
  "NEXT_PUBLIC_APP_NAME=Plateforme-AFD",
  "",
  `NEXT_PUBLIC_SUPABASE_URL=${pick("NEXT_PUBLIC_SUPABASE_URL", "https://mxxuxnoqnwjygawvvhcb.supabase.co")}`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY=${pick("NEXT_PUBLIC_SUPABASE_ANON_KEY")}`,
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${pick("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")}`,
  // Alias runtime serveur (recommandé Hostinger — lu même si le build a été fait trop tôt)
  `SUPABASE_ANON_KEY=${pick("SUPABASE_ANON_KEY", pick("NEXT_PUBLIC_SUPABASE_ANON_KEY", pick("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")))}`,
  `SUPABASE_SERVICE_ROLE_KEY=${pick("SUPABASE_SERVICE_ROLE_KEY", pick("SUPABASE_SECRET_KEY"))}`,
  "",
  "# Démo client — carte RDC bleue",
  "NEXT_PUBLIC_ENABLE_DEMO_CONTENT=true",
  "NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA=true",
  "NEXT_PUBLIC_ENABLE_SPONTANEOUS_APPLICATIONS=false",
  "NEXT_PUBLIC_ENABLE_WATER_RIPPLE=true",
  "NEXT_PUBLIC_ENABLE_SECTION_ANIMATIONS=true",
  "NEXT_PUBLIC_ENABLE_MOBILE_RAILS=true",
  "",
  "# Contact / SMTP",
  `CONTACT_NOTIFICATION_EMAIL=${pick("CONTACT_NOTIFICATION_EMAIL", "contactafdrdc@gmail.com")}`,
  `CONTACT_FROM_EMAIL=${pick("CONTACT_FROM_EMAIL", "contact@afd-rdc.org")}`,
  `CONTACT_FROM_NAME=${pick("CONTACT_FROM_NAME", "Site officiel AFD")}`,
  `CONTACT_AUTO_REPLY_ENABLED=${pick("CONTACT_AUTO_REPLY_ENABLED", "true")}`,
  `MAIL_SMTP_HOST=${pick("MAIL_SMTP_HOST", "afd-rdc.org")}`,
  `MAIL_SMTP_PORT=${pick("MAIL_SMTP_PORT", "587")}`,
  `MAIL_SMTP_SECURE=${pick("MAIL_SMTP_SECURE", "false")}`,
  `MAIL_SMTP_USERNAME=${pick("MAIL_SMTP_USERNAME", "contact@afd-rdc.org")}`,
  `MAIL_SMTP_PASSWORD=${pick("MAIL_SMTP_PASSWORD")}`,
  "MAIL_INTEGRATED_ENABLED=false",
  `MAIL_IMAP_HOST=${pick("MAIL_IMAP_HOST", "afd-rdc.org")}`,
  "MAIL_IMAP_PORT=993",
  "MAIL_IMAP_SECURE=true",
  `MAIL_WEBMAIL_URL=${pick("MAIL_WEBMAIL_URL")}`,
  "CYBERPANEL_PANEL_URL=https://panel.afd-rdc.org:8090",
  "",
  "NEWSLETTER_SEND_ENABLED=false",
  "SERDIPAY_ENABLED=false",
  "OCR_CLOUD_ENABLED=false",
  "OCR_PROVIDER=native",
  "OCR_ORGANISATION_ID=afd-asbl",
];

const outDir = path.join(root, "Deploy");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "hostinger.env");
fs.writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");

const missing = [];
if (!pick("NEXT_PUBLIC_SUPABASE_ANON_KEY") && !pick("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")) {
  missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY ou PUBLISHABLE_KEY");
}
if (!pick("SUPABASE_SERVICE_ROLE_KEY") && !pick("SUPABASE_SECRET_KEY")) {
  missing.push("SUPABASE_SERVICE_ROLE_KEY");
}

console.log(`OK → ${outPath}`);
if (missing.length) {
  console.log("À compléter manuellement :", missing.join(", "));
} else {
  console.log("Clés Supabase présentes (valeurs non affichées).");
}
console.log("Démo : NEXT_PUBLIC_ENABLE_DEMO_CONTENT=true");
