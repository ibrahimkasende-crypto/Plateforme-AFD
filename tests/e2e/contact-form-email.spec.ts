import { expect, test } from "@playwright/test";

test.describe("Contact — API et secrets", () => {
  test("refuse un payload invalide", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { email: "pas-un-email", consent: true },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBeFalsy();
  });

  test("honeypot ne crée pas d’erreur visible", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {
        name: "Bot",
        email: "bot@example.com",
        subject: "Spam test sujet",
        message: "Message honeypot suffisamment long",
        consent: true,
        website: "https://spam.example",
      },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.ok).toBeTruthy();
  });

  test("aucun secret SMTP dans la page contact", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "domcontentloaded" });
    const html = await page.content();
    expect(html).not.toMatch(/MAIL_SMTP_PASSWORD/i);
    expect(html.toLowerCase()).not.toContain("client_secret");
    await expect(page.getByLabel(/Nom complet/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Envoyer le message/i }),
    ).toBeVisible();
  });
});
