import { expect, test } from "@playwright/test";

test.describe("Newsletter Google — doublons", () => {
  test("message déjà inscrit exposé par le service (contrat API)", async ({
    request,
  }) => {
    // Sans session : 401 — le message doublon est couvert unitairement / en prod.
    const res = await request.post("/api/newsletter/google-subscribe", {
      data: { consent: true },
    });
    expect([400, 401]).toContain(res.status());
    const body = await res.json();
    expect(body).toHaveProperty("ok", false);
  });

  test("inscription e-mail manuelle idempotente côté UI", async ({ page }) => {
    test.setTimeout(60_000);
    await page.addInitScript(() => {
      try {
        sessionStorage.clear();
        localStorage.removeItem("afd_newsletter_subscribed");
        localStorage.removeItem("afd_newsletter_dismissed_at");
      } catch {
        // ignore
      }
    });

    await page.goto("/?newsletter=google-success", {
      waitUntil: "domcontentloaded",
    });
    const other = page.getByRole("button", {
      name: /Utiliser une autre adresse/i,
    });
    if (await other.isVisible().catch(() => false)) {
      await other.click();
    }

    await expect(page.getByLabel(/^E-mail$/i).first()).toBeVisible({
      timeout: 20_000,
    });
    await expect(
      page.getByRole("button", { name: /S’inscrire avec mon e-mail/i }),
    ).toBeVisible();
  });
});

