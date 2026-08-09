import { describe, expect, it } from "vitest";
import {
  buildContactAutoReplySubject,
  buildContactAutoReplyText,
  buildContactNotificationHtml,
  buildContactNotificationSubject,
  buildContactNotificationText,
} from "@/lib/contact/contact-email-templates";

const payload = {
  id: "11111111-2222-4333-8444-555555555555",
  name: "Marie Test",
  email: "marie.visiteuse@example.com",
  phone: "+243 900 000 000",
  organisation: "ONG Exemple",
  requestType: "information",
  subject: "Demande d’information",
  message: "Bonjour, je souhaite en savoir plus.",
  province: "Kinshasa",
  createdAt: "6 août 2026 à 10:00",
  dashboardUrl:
    "https://afd-rdc.org/admin/messages/11111111-2222-4333-8444-555555555555",
};

describe("contact email templates", () => {
  it("sujet notification", () => {
    expect(buildContactNotificationSubject(payload.subject)).toBe(
      "Nouveau message depuis le site AFD — Demande d’information",
    );
  });

  it("version texte complète", () => {
    const text = buildContactNotificationText(payload);
    expect(text).toContain(payload.email);
    expect(text).toContain(payload.message);
    expect(text).toContain(payload.dashboardUrl);
    expect(text).toContain(payload.id);
  });

  it("version HTML lisible avec lien dashboard", () => {
    const html = buildContactNotificationHtml(payload);
    expect(html).toContain("Nouveau message");
    expect(html).toContain(payload.dashboardUrl);
    expect(html).toContain("marie.visiteuse@example.com");
    expect(html).not.toContain("<script");
  });

  it("auto-réponse", () => {
    expect(buildContactAutoReplySubject()).toContain("AFD");
    const text = buildContactAutoReplyText({
      name: "Marie",
      subject: "Demande",
    });
    expect(text).toContain("Marie");
    expect(text).toContain("Demande");
    expect(text).toContain("Alliance des Femmes pour le Développement");
  });
});
