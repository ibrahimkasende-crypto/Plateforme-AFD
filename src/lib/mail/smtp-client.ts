import "server-only";

import { MailError, MAIL_ERROR_CODES } from "@/lib/mail/mail-errors";
import { isMailConfigReadyForSmtp } from "@/lib/mail/mail-config";

/**
 * Client SMTP — Phase 2.
 * Envoi désactivé jusqu’à validation serveur.
 */
export async function assertSmtpReady(): Promise<void> {
  if (!isMailConfigReadyForSmtp() || process.env.MAIL_INTEGRATED_ENABLED !== "true") {
    throw new MailError(
      MAIL_ERROR_CODES.PHASE2_DISABLED,
      "L’envoi SMTP intégré n’est pas encore activé. Utilisez le webmail.",
      501,
    );
  }
}

export async function sendMail(_params: {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  text?: string;
  html?: string;
}): Promise<{ messageId: string }> {
  await assertSmtpReady();
  throw new MailError(
    MAIL_ERROR_CODES.PHASE2_DISABLED,
    "Envoi SMTP non branché.",
    501,
  );
}

export async function replyMail(_params: {
  from: string;
  to: string[];
  subject: string;
  text?: string;
  html?: string;
  inReplyTo?: string;
}): Promise<{ messageId: string }> {
  return sendMail(_params);
}

export async function forwardMail(_params: {
  from: string;
  to: string[];
  subject: string;
  text?: string;
  html?: string;
}): Promise<{ messageId: string }> {
  return sendMail(_params);
}
