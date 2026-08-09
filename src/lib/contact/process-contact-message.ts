import "server-only";

import { createNotification } from "@/features/notifications/services/notifications.service";
import {
  getContactNotificationEnv,
  isContactSmtpConfigured,
  sanitizeSmtpErrorMessage,
} from "@/lib/contact/contact-env";
import {
  buildContactAutoReplyHtml,
  buildContactAutoReplySubject,
  buildContactAutoReplyText,
  buildContactNotificationHtml,
  buildContactNotificationSubject,
  buildContactNotificationText,
} from "@/lib/contact/contact-email-templates";
import { sendContactSmtpMail } from "@/lib/contact/contact-smtp";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";
import { createClientSafe } from "@/lib/supabase/safe";

export type ContactMessageInput = {
  name: string;
  email: string;
  phone?: string | null;
  organisation?: string | null;
  requestType?: string | null;
  subject: string;
  message: string;
  province?: string | null;
};

export type ProcessContactResult = {
  ok: boolean;
  messageId?: string;
  emailNotificationSent: boolean;
  emailNotificationError?: string;
  autoReplySent: boolean;
  reason?: "unavailable" | "insert_failed" | "validation";
};

function formatCreatedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Africa/Kinshasa",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

async function getDbClient() {
  const admin = createAdminServiceClient();
  if (admin) return { client: admin, viaServiceRole: true as const };
  const safe = await createClientSafe();
  if (!safe) return null;
  return { client: safe, viaServiceRole: false as const };
}

async function createInternalNotification(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  messageId: string,
  subject: string,
  name: string,
) {
  try {
    const { data: admins } = await supabase
      .from("profils_administrateurs")
      .select("id")
      .eq("actif", true)
      .limit(50);

    const recipientUserIds = Array.isArray(admins)
      ? admins
          .map((row: { id?: string }) => row.id)
          .filter((id: string | undefined): id is string => Boolean(id))
      : [];

    await createNotification(supabase, {
      type: "contact_message",
      titre: "Nouveau message de contact",
      message: `${name} — ${subject}`,
      recipientUserIds,
      module: "messages",
      entityType: "messages",
      entityId: messageId,
      priorite: "normale",
      lien: `/admin/messages/${messageId}`,
    });
  } catch (err) {
    console.error("[contact] notification_interne", {
      step: "createNotification",
      at: new Date().toISOString(),
      type: err instanceof Error ? err.name : "unknown",
    });
  }
}

async function updateEmailTracking(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  messageId: string,
  patch: Record<string, unknown>,
) {
  try {
    await supabase.from("messages").update(patch).eq("id", messageId);
  } catch (err) {
    console.error("[contact] email_tracking", {
      step: "update",
      at: new Date().toISOString(),
      type: err instanceof Error ? err.name : "unknown",
    });
  }
}

/**
 * Flux contact : validation déjà faite par l’appelant.
 * Ordre : insert → notif interne → SMTP → statut → auto-réponse.
 * Une panne SMTP ne fait jamais échouer l’enregistrement.
 */
export async function processContactMessage(
  input: ContactMessageInput,
): Promise<ProcessContactResult> {
  const db = await getDbClient();
  if (!db) {
    return {
      ok: false,
      reason: "unavailable",
      emailNotificationSent: false,
      autoReplySent: false,
    };
  }

  const { client: supabase, viaServiceRole } = db;
  const env = getContactNotificationEnv();
  const nowIso = new Date().toISOString();

  const payload = {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || null,
    subject: input.subject.trim(),
    message: input.message.trim(),
    status: "unread",
    organisation: input.organisation?.trim() || null,
    request_type: input.requestType?.trim() || null,
    province: input.province?.trim() || null,
    email_notification_status: "pending",
    notification_recipient: env.notificationEmail,
    notification_attempts: 0,
    created_at: nowIso,
  };

  let insertResult = await supabase
    .from("messages")
    .insert(payload as never)
    .select("id, created_at")
    .single();

  // Colonnes e-mail absentes (migration non appliquée) : insert minimal
  if (insertResult.error) {
    const msg = (insertResult.error.message || "").toLowerCase();
    if (
      msg.includes("organisation") ||
      msg.includes("email_notification") ||
      msg.includes("request_type") ||
      msg.includes("province") ||
      msg.includes("column") ||
      msg.includes("schema cache")
    ) {
      insertResult = await supabase
        .from("messages")
        .insert({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          subject: payload.subject,
          message: payload.message,
          status: "unread",
          created_at: nowIso,
        } as never)
        .select("id, created_at")
        .single();
    }
  }

  // Anon sans SELECT policy : insert sans returning
  if (insertResult.error && !viaServiceRole) {
    const bare = await supabase.from("messages").insert({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      subject: payload.subject,
      message: payload.message,
      status: "unread",
    } as never);

    if (bare.error) {
      console.error("[contact] insert_failed", {
        step: "insert",
        at: new Date().toISOString(),
        type: bare.error.code || "insert_error",
      });
      return {
        ok: false,
        reason: "insert_failed",
        emailNotificationSent: false,
        autoReplySent: false,
      };
    }

    return {
      ok: true,
      emailNotificationSent: false,
      emailNotificationError:
        "Message enregistré, mais l’identifiant n’a pas pu être récupéré pour l’e-mail (service role requis).",
      autoReplySent: false,
    };
  }

  if (insertResult.error || !insertResult.data) {
    console.error("[contact] insert_failed", {
      step: "insert",
      at: new Date().toISOString(),
      type: insertResult.error?.code || "insert_error",
    });
    return {
      ok: false,
      reason: "insert_failed",
      emailNotificationSent: false,
      autoReplySent: false,
    };
  }

  const row = insertResult.data as { id: string; created_at?: string | null };
  const messageId = row.id;
  const createdAt = formatCreatedAt(row.created_at || nowIso);

  await createInternalNotification(
    supabase,
    messageId,
    payload.subject,
    payload.name,
  );

  let emailNotificationSent = false;
  let emailNotificationError: string | undefined;
  let autoReplySent = false;

  if (!isContactSmtpConfigured()) {
    emailNotificationError =
      "SMTP contact non configuré (variables serveur manquantes).";
    await updateEmailTracking(supabase, messageId, {
      email_notification_status: "failed",
      email_notification_error: emailNotificationError,
      notification_attempts: 1,
      notification_recipient: env.notificationEmail,
    });
  } else {
    const dashboardUrl = `${env.siteUrl}/admin/messages/${messageId}`;
    const emailPayload = {
      id: messageId,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      organisation: payload.organisation,
      requestType: payload.request_type,
      subject: payload.subject,
      message: payload.message,
      province: payload.province,
      createdAt,
      dashboardUrl,
    };

    await updateEmailTracking(supabase, messageId, {
      email_notification_status: "retrying",
      notification_attempts: 1,
      notification_recipient: env.notificationEmail,
    });

    const sendResult = await sendContactSmtpMail({
      to: env.notificationEmail!,
      replyTo: payload.email,
      subject: buildContactNotificationSubject(payload.subject),
      text: buildContactNotificationText(emailPayload),
      html: buildContactNotificationHtml(emailPayload),
    });

    if (sendResult.ok) {
      emailNotificationSent = true;
      await updateEmailTracking(supabase, messageId, {
        email_notification_status: "sent",
        email_notification_sent_at: new Date().toISOString(),
        email_notification_error: null,
        notification_recipient: env.notificationEmail,
      });
    } else {
      emailNotificationError = sendResult.error;
      await updateEmailTracking(supabase, messageId, {
        email_notification_status: "failed",
        email_notification_error: sanitizeSmtpErrorMessage(sendResult.error),
        notification_recipient: env.notificationEmail,
      });
    }

    if (env.autoReplyEnabled && emailNotificationSent) {
      const auto = await sendContactSmtpMail({
        to: payload.email,
        replyTo: env.notificationEmail || undefined,
        subject: buildContactAutoReplySubject(),
        text: buildContactAutoReplyText({
          name: payload.name,
          subject: payload.subject,
        }),
        html: buildContactAutoReplyHtml({
          name: payload.name,
          subject: payload.subject,
        }),
      });

      if (auto.ok) {
        autoReplySent = true;
        await updateEmailTracking(supabase, messageId, {
          auto_reply_status: "sent",
          auto_reply_sent_at: new Date().toISOString(),
        });
      } else {
        await updateEmailTracking(supabase, messageId, {
          auto_reply_status: "failed",
        });
      }
    } else if (!env.autoReplyEnabled) {
      await updateEmailTracking(supabase, messageId, {
        auto_reply_status: "skipped",
      });
    }
  }

  return {
    ok: true,
    messageId,
    emailNotificationSent,
    emailNotificationError,
    autoReplySent,
  };
}
