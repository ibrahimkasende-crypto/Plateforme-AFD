import "server-only";

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import {
  getContactNotificationEnv,
  isContactSmtpConfigured,
  sanitizeSmtpErrorMessage,
} from "@/lib/contact/contact-env";

let cachedTransporter: Transporter | null = null;

export function createContactSmtpTransporter(): Transporter {
  const env = getContactNotificationEnv();
  if (!isContactSmtpConfigured()) {
    throw new Error(
      "SMTP contact incomplet (MAIL_SMTP_* / CONTACT_* manquants).",
    );
  }

  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    host: env.smtpHost!,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUsername!,
      pass: env.smtpPassword!,
    },
  });

  return cachedTransporter;
}

export async function verifyContactSmtp(): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const transporter = createContactSmtpTransporter();
    await transporter.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: sanitizeSmtpErrorMessage(err) };
  }
}

export async function sendContactSmtpMail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: true; messageId?: string } | { ok: false; error: string }> {
  try {
    const env = getContactNotificationEnv();
    const transporter = createContactSmtpTransporter();
    const info = await transporter.sendMail({
      from: `"${env.fromName}" <${env.fromEmail}>`,
      to: input.to,
      replyTo: input.replyTo,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    return { ok: false, error: sanitizeSmtpErrorMessage(err) };
  }
}
