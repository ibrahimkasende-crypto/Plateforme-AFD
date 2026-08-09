/**
 * Test SMTP contact AFD — n’affiche jamais le mot de passe.
 *
 * Usage :
 *   npm run email:test-contact
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import nodemailer from "nodemailer";

function loadEnvFile(fileName: string) {
  const path = resolve(process.cwd(), fileName);
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env) || !process.env[key]) {
      process.env[key] = value;
    }
  }
}

function sanitize(raw: unknown): string {
  let text =
    raw instanceof Error
      ? raw.message
      : typeof raw === "string"
        ? raw
        : "Erreur SMTP";
  const password = process.env.MAIL_SMTP_PASSWORD?.trim();
  if (password && password.length > 2) {
    text = text.split(password).join("[redacted]");
  }
  return text
    .replace(/pass(word)?[=:]\s*\S+/gi, "password=[redacted]")
    .slice(0, 400);
}

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const host = process.env.MAIL_SMTP_HOST?.trim();
  const port = Number(process.env.MAIL_SMTP_PORT || 587);
  const secure = /^(1|true|yes|on)$/i.test(
    process.env.MAIL_SMTP_SECURE?.trim() || "",
  );
  const user = process.env.MAIL_SMTP_USERNAME?.trim();
  const pass = process.env.MAIL_SMTP_PASSWORD?.trim();
  const to = process.env.CONTACT_NOTIFICATION_EMAIL?.trim();
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL?.trim() || user || undefined;
  const fromName =
    process.env.CONTACT_FROM_NAME?.trim() || "Site officiel AFD";

  console.log("Test e-mail contact AFD");
  console.log(`SMTP host : ${host || "(manquant)"}`);
  console.log(`SMTP port : ${Number.isFinite(port) ? port : "(invalide)"}`);
  console.log(`SMTP user : ${user || "(manquant)"}`);
  console.log(`SMTP pass : ${pass ? "[défini]" : "(manquant)"}`);
  console.log(`From      : ${fromEmail || "(manquant)"}`);
  console.log(`To        : ${to || "(manquant)"}`);

  if (!host || !user || !pass || !to || !fromEmail) {
    console.error(
      "ÉCHEC — variables manquantes (MAIL_SMTP_* / CONTACT_*). Aucun secret affiché.",
    );
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number.isFinite(port) && port > 0 ? port : 587,
    secure,
    auth: { user, pass },
  });

  try {
    await transporter.verify();
    console.log("Connexion SMTP : OK");
  } catch (err) {
    console.error(`ÉCHEC connexion SMTP : ${sanitize(err)}`);
    process.exit(1);
  }

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject: "[TEST] Notification contact AFD",
      text: "Message de test SMTP contact AFD. Aucune action requise.",
      html: "<p>Message de test SMTP contact AFD. Aucune action requise.</p>",
    });
    console.log(`SUCCÈS — e-mail de test envoyé (id: ${info.messageId || "n/a"})`);
  } catch (err) {
    console.error(`ÉCHEC envoi : ${sanitize(err)}`);
    process.exit(1);
  }
}

void main();
