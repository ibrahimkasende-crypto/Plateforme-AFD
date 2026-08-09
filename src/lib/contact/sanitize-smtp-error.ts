/** Nettoie un message d’erreur SMTP (jamais de mot de passe). */
export function sanitizeSmtpErrorMessage(raw: unknown): string {
  let text =
    raw instanceof Error
      ? raw.message
      : typeof raw === "string"
        ? raw
        : "Erreur SMTP inconnue";

  const password = process.env.MAIL_SMTP_PASSWORD?.trim();
  if (password && password.length > 2) {
    text = text.split(password).join("[redacted]");
  }

  text = text
    .replace(/pass(word)?[=:]\s*\S+/gi, "password=[redacted]")
    .replace(/auth[^,]{0,40}/gi, (m) =>
      /pass/i.test(m) ? "auth=[redacted]" : m,
    );

  return text.slice(0, 400);
}
