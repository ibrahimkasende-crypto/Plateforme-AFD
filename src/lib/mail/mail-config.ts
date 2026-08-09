import "server-only";

export type MailServerConfig = {
  webmailUrl: string | null;
  imapHost: string | null;
  imapPort: number;
  imapSecure: boolean;
  smtpHost: string | null;
  smtpPort: number;
  smtpSecure: boolean;
  domain: string;
  cyberpanelPanelUrl: string | null;
  integratedMailEnabled: boolean;
};

function envBool(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value === "") return fallback;
  return /^(1|true|yes|on)$/i.test(value.trim());
}

function envInt(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

/**
 * Configuration messagerie professionnelle (serveur uniquement).
 * Jamais de NEXT_PUBLIC_* pour ces secrets / hôtes opérationnels.
 */
export function getMailServerConfig(): MailServerConfig {
  const imapHost = process.env.MAIL_IMAP_HOST?.trim() || null;
  const smtpHost = process.env.MAIL_SMTP_HOST?.trim() || null;
  const webmailUrl = process.env.MAIL_WEBMAIL_URL?.trim() || null;
  const integrated =
    envBool(process.env.MAIL_INTEGRATED_ENABLED, false) &&
    Boolean(imapHost) &&
    Boolean(smtpHost);

  return {
    webmailUrl,
    imapHost,
    imapPort: envInt(process.env.MAIL_IMAP_PORT, 993),
    imapSecure: envBool(process.env.MAIL_IMAP_SECURE, true),
    smtpHost,
    smtpPort: envInt(process.env.MAIL_SMTP_PORT, 587),
    smtpSecure: envBool(process.env.MAIL_SMTP_SECURE, false),
    domain: process.env.MAIL_DOMAIN?.trim() || "afd-rdc.org",
    cyberpanelPanelUrl:
      process.env.CYBERPANEL_PANEL_URL?.trim() ||
      "https://panel.afd-rdc.org:8090",
    integratedMailEnabled: integrated,
  };
}

export function isMailConfigReadyForImap(): boolean {
  const cfg = getMailServerConfig();
  return Boolean(cfg.imapHost && cfg.imapPort);
}

export function isMailConfigReadyForSmtp(): boolean {
  const cfg = getMailServerConfig();
  return Boolean(cfg.smtpHost && cfg.smtpPort);
}
