import "server-only";

export { sanitizeSmtpErrorMessage } from "@/lib/contact/sanitize-smtp-error";

function envBool(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value === "") return fallback;
  return /^(1|true|yes|on)$/i.test(value.trim());
}

function envInt(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

/**
 * Configuration serveur pour les notifications e-mail du formulaire contact.
 * Aucune de ces valeurs ne doit être exposée via NEXT_PUBLIC_*.
 */
export function getContactNotificationEnv() {
  return {
    notificationEmail:
      process.env.CONTACT_NOTIFICATION_EMAIL?.trim() || null,
    fromEmail:
      process.env.CONTACT_FROM_EMAIL?.trim() ||
      process.env.MAIL_SMTP_USERNAME?.trim() ||
      null,
    fromName:
      process.env.CONTACT_FROM_NAME?.trim() || "Site officiel AFD",
    autoReplyEnabled: envBool(
      process.env.CONTACT_AUTO_REPLY_ENABLED,
      false,
    ),
    smtpHost: process.env.MAIL_SMTP_HOST?.trim() || null,
    smtpPort: envInt(process.env.MAIL_SMTP_PORT, 587),
    smtpSecure: envBool(process.env.MAIL_SMTP_SECURE, false),
    smtpUsername: process.env.MAIL_SMTP_USERNAME?.trim() || null,
    smtpPassword: process.env.MAIL_SMTP_PASSWORD?.trim() || null,
    siteUrl:
      process.env.NEXT_PUBLIC_SITE_URL?.trim()?.replace(/\/$/, "") ||
      "https://afd-rdc.org",
  };
}

export function isContactSmtpConfigured(): boolean {
  const env = getContactNotificationEnv();
  return Boolean(
    env.smtpHost &&
      env.smtpUsername &&
      env.smtpPassword &&
      env.notificationEmail &&
      env.fromEmail,
  );
}
