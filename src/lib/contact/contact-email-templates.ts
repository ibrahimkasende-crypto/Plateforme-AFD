export type ContactEmailPayload = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  organisation?: string | null;
  requestType?: string | null;
  subject: string;
  message: string;
  province?: string | null;
  createdAt: string;
  dashboardUrl: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function display(value: string | null | undefined): string {
  const t = value?.trim();
  return t ? t : "—";
}

export function buildContactNotificationSubject(subject: string): string {
  return `Nouveau message depuis le site AFD — ${subject.trim()}`;
}

export function buildContactNotificationText(payload: ContactEmailPayload): string {
  return [
    "Nouveau message reçu via le site officiel AFD",
    "",
    `Nom : ${payload.name}`,
    `E-mail : ${payload.email}`,
    `Téléphone : ${display(payload.phone)}`,
    `Organisation : ${display(payload.organisation)}`,
    `Type de demande : ${display(payload.requestType)}`,
    `Province : ${display(payload.province)}`,
    `Sujet : ${payload.subject}`,
    "",
    "Message :",
    payload.message,
    "",
    `Date : ${payload.createdAt}`,
    `Identifiant : ${payload.id}`,
    `Dashboard : ${payload.dashboardUrl}`,
  ].join("\n");
}

export function buildContactNotificationHtml(
  payload: ContactEmailPayload,
): string {
  const rows: Array<[string, string]> = [
    ["Nom complet", payload.name],
    ["Adresse e-mail", payload.email],
    ["Téléphone", display(payload.phone)],
    ["Organisation", display(payload.organisation)],
    ["Type de demande", display(payload.requestType)],
    ["Province", display(payload.province)],
    ["Sujet", payload.subject],
    ["Date et heure", payload.createdAt],
    ["Identifiant", payload.id],
  ];

  const rowHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5eef7;color:#5f6f83;width:160px;font-size:13px;">${escapeHtml(label)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5eef7;color:#062653;font-size:14px;font-weight:600;">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Segoe UI,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #d9e4f0;">
          <tr>
            <td style="background:#0877d1;color:#ffffff;padding:18px 22px;font-size:18px;font-weight:700;">
              Nouveau message — Site officiel AFD
            </td>
          </tr>
          <tr>
            <td style="padding:8px 10px 4px;">
              <table width="100%" cellspacing="0" cellpadding="0">${rowHtml}</table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 22px;">
              <p style="margin:0 0 8px;color:#5f6f83;font-size:13px;font-weight:600;">Message</p>
              <div style="white-space:pre-wrap;line-height:1.55;color:#062653;font-size:14px;background:#f7fafc;border-radius:8px;padding:14px;border:1px solid #e5eef7;">${escapeHtml(payload.message)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 22px 24px;" align="center">
              <a href="${escapeHtml(payload.dashboardUrl)}" style="display:inline-block;background:#e99308;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 20px;border-radius:8px;">
                Ouvrir dans le dashboard
              </a>
              <p style="margin:12px 0 0;font-size:12px;color:#5f6f83;">
                ${escapeHtml(payload.dashboardUrl)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildContactAutoReplySubject(): string {
  return "Nous avons bien reçu votre message — AFD";
}

export function buildContactAutoReplyText(input: {
  name: string;
  subject: string;
}): string {
  return [
    `Bonjour ${input.name},`,
    "",
    `Nous confirmons la réception de votre message intitulé « ${input.subject} ».`,
    "",
    "Notre équipe vous répondra dans les meilleurs délais.",
    "",
    "Cordialement,",
    "Alliance des Femmes pour le Développement",
  ].join("\n");
}

export function buildContactAutoReplyHtml(input: {
  name: string;
  subject: string;
}): string {
  return `<!DOCTYPE html>
<html lang="fr">
<body style="margin:0;padding:24px;background:#f4f7fb;font-family:Segoe UI,Arial,sans-serif;color:#062653;">
  <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #d9e4f0;padding:24px;">
    <tr><td>
      <p style="margin:0 0 12px;font-size:16px;">Bonjour ${escapeHtml(input.name)},</p>
      <p style="margin:0 0 12px;line-height:1.55;font-size:15px;">
        Nous confirmons la réception de votre message intitulé
        «&nbsp;${escapeHtml(input.subject)}&nbsp;».
      </p>
      <p style="margin:0 0 16px;line-height:1.55;font-size:15px;">
        Notre équipe vous répondra dans les meilleurs délais.
      </p>
      <p style="margin:0;line-height:1.55;font-size:15px;">
        Cordialement,<br/>
        <strong>Alliance des Femmes pour le Développement</strong>
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}
