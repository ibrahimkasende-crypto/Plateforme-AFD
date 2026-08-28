import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function load(file: string): Record<string, string> {
  const p = resolve(process.cwd(), file);
  if (!existsSync(p)) return {};
  const out: Record<string, string> = {};
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i <= 0) continue;
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    // Nettoie espaces / retours parasites (fréquent Hostinger)
    v = v.replace(/\s+/g, "").trim();
    out[t.slice(0, i).trim()] = v;
  }
  return out;
}

function meta(label: string, key?: string) {
  if (!key) {
    console.log(`${label}: ABSENT`);
    return;
  }
  const kind = key.startsWith("eyJ")
    ? "jwt"
    : key.startsWith("sb_publishable_")
      ? "publishable"
      : key.startsWith("sb_secret_")
        ? "secret"
        : "other";
  const fp = createHash("sha256").update(key).digest("hex").slice(0, 10);
  console.log(
    `${label}: kind=${kind} len=${key.length} fp=${fp} starts=${key.slice(0, 18)}…`,
  );
}

async function trySignIn(label: string, url: string, key?: string) {
  if (!key) return false;
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await client.auth.signInWithPassword({
    email: "ibrahimkasende21@gmail.com",
    password: "AFD-Admin-2026!",
  });
  console.log(
    `${label} signIn:`,
    error ? `FAIL ${error.message}` : "OK",
  );
  return !error;
}

async function main() {
  const local = load(".env.local");
  const host = load("Deploy/hostinger.env");
  const url =
    local.NEXT_PUBLIC_SUPABASE_URL ||
    host.NEXT_PUBLIC_SUPABASE_URL ||
    "https://mxxuxnoqnwjygawvvhcb.supabase.co";

  console.log("URL", url);
  meta("local.ANON", local.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  meta("local.PUB", local.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  meta("host.ANON", host.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  meta("host.PUB", host.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  meta("host.SUPABASE_ANON", host.SUPABASE_ANON_KEY);

  const candidates: Array<[string, string | undefined]> = [
    ["local.ANON", local.NEXT_PUBLIC_SUPABASE_ANON_KEY],
    ["local.PUB", local.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY],
    ["host.ANON", host.NEXT_PUBLIC_SUPABASE_ANON_KEY],
    ["host.PUB", host.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY],
    ["host.SUPABASE_ANON", host.SUPABASE_ANON_KEY],
  ];

  let working: string | undefined;
  for (const [label, key] of candidates) {
    if (!key) continue;
    if (await trySignIn(label, url, key)) {
      working = key;
      console.log("WORKING_KEY_SOURCE", label);
      break;
    }
  }

  if (!working) {
    console.error("Aucune clé publique ne fonctionne.");
    process.exit(1);
  }

  // Régénère un hostinger.env propre avec UNIQUEMENT la clé qui marche
  const service =
    local.SUPABASE_SERVICE_ROLE_KEY ||
    local.SUPABASE_SECRET_KEY ||
    host.SUPABASE_SERVICE_ROLE_KEY ||
    "";

  const isJwt = working.startsWith("eyJ");
  // Écrit la clé qui marche dans TOUTES les variables publiques pour écraser
  // une ancienne ANON_KEY invalide encore présente dans le panneau Hostinger.
  const lines = [
    "# Plateforme-AFD — Hostinger (clé VALIDÉE contre mxxux)",
    "# 1) Supprimer les anciennes vars SUPABASE_* dans Hostinger",
    "# 2) Importer ce fichier tel quel",
    "# 3) Rebuild + Redeploy (obligatoire)",
    "",
    "NEXT_PUBLIC_APP_ENV=production",
    "NEXT_PUBLIC_SITE_URL=https://afd-rdc.org",
    "NEXT_PUBLIC_APP_NAME=Plateforme-AFD",
    "",
    "NEXT_PUBLIC_SUPABASE_URL=https://mxxuxnoqnwjygawvvhcb.supabase.co",
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=${working}`,
    `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${isJwt ? "" : working}`,
    `SUPABASE_ANON_KEY=${working}`,
    `SUPABASE_SERVICE_ROLE_KEY=${service}`,
    "",
    "NEXT_PUBLIC_ENABLE_DEMO_CONTENT=true",
    "NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA=true",
    "NEXT_PUBLIC_ENABLE_SPONTANEOUS_APPLICATIONS=false",
    "NEXT_PUBLIC_ENABLE_WATER_RIPPLE=true",
    "NEXT_PUBLIC_ENABLE_SECTION_ANIMATIONS=true",
    "NEXT_PUBLIC_ENABLE_MOBILE_RAILS=true",
    "",
    "CONTACT_NOTIFICATION_EMAIL=contactafdrdc@gmail.com",
    "CONTACT_FROM_EMAIL=contact@afd-rdc.org",
    "CONTACT_FROM_NAME=Site officiel AFD",
    "CONTACT_AUTO_REPLY_ENABLED=true",
    "MAIL_SMTP_HOST=afd-rdc.org",
    "MAIL_SMTP_PORT=587",
    "MAIL_SMTP_SECURE=false",
    "MAIL_SMTP_USERNAME=contact@afd-rdc.org",
    `MAIL_SMTP_PASSWORD=${local.MAIL_SMTP_PASSWORD || host.MAIL_SMTP_PASSWORD || "AFD-001"}`,
    "MAIL_INTEGRATED_ENABLED=false",
    "MAIL_IMAP_HOST=afd-rdc.org",
    "MAIL_IMAP_PORT=993",
    "MAIL_IMAP_SECURE=true",
    "CYBERPANEL_PANEL_URL=https://panel.afd-rdc.org:8090",
    "",
    "NEWSLETTER_SEND_ENABLED=false",
    "CARD_PAYMENT_ENABLED=false",
    "OCR_CLOUD_ENABLED=false",
    "OCR_PROVIDER=native",
    "OCR_ORGANISATION_ID=afd-asbl",
    "",
  ];

  const out = resolve(process.cwd(), "Deploy/hostinger.env");
  writeFileSync(out, lines.join("\n"), "utf8");
  writeFileSync(resolve(process.cwd(), "hostinger.env"), lines.join("\n"), "utf8");
  writeFileSync(
    resolve(process.cwd(), "..", "hostinger.env"),
    lines.join("\n"),
    "utf8",
  );
  console.log("HOSTINGER_ENV_WRITTEN", out);
  console.log(
    "KEY_TYPE",
    isJwt ? "anon_jwt" : "publishable",
    "fp",
    createHash("sha256").update(working).digest("hex").slice(0, 10),
  );
}

void main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
