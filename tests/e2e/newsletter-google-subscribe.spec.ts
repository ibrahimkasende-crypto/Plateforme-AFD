import { expect, test } from "@playwright/test";

test.describe("Newsletter Google — subscribe API", () => {
  test("refuse sans consentement", async ({ request }) => {
    const res = await request.post("/api/newsletter/google-subscribe", {
      data: { consent: false },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBeFalsy();
  });

  test("refuse sans session", async ({ request }) => {
    const res = await request.post("/api/newsletter/google-subscribe", {
      data: { consent: true },
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.ok).toBeFalsy();
    expect(String(body.message)).toMatch(/session|Google/i);
  });

  test("étape consentement obligatoire dans l’UI", async ({ page }) => {
    test.setTimeout(60_000);
    await page.addInitScript(() => {
      try {
        sessionStorage.clear();
        localStorage.removeItem("afd_newsletter_subscribed");
      } catch {
        // ignore
      }
    });

    await page.goto("/?newsletter=google-success", {
      waitUntil: "domcontentloaded",
    });

    const confirm = page.getByRole("button", {
      name: /Confirmer mon inscription/i,
    });
    const google = page.getByRole("button", {
      name: /Continuer avec Google/i,
    });
    const emailSubmit = page.getByRole("button", {
      name: /S’inscrire avec mon e-mail/i,
    });

    await expect(confirm.or(google).or(emailSubmit).first()).toBeVisible({
      timeout: 20_000,
    });

    if (await confirm.isVisible().catch(() => false)) {
      await confirm.click();
      await expect(
        page.getByText(/consentement|Cochez la case/i).first(),
      ).toBeVisible();
    }
  });
});

