import { expect, test, type Page } from "@playwright/test";

async function openNewsletterPopup(page: Page) {
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
  await expect(page.locator('[role="dialog"]').first()).toBeVisible({
    timeout: 20_000,
  });
}

test.describe("Newsletter Google — bouton", () => {
  test("bouton Continuer avec Google visible et cliquable", async ({
    page,
  }) => {
    test.setTimeout(60_000);

    await openNewsletterPopup(page);

    const other = page.getByRole("button", {
      name: /Utiliser une autre adresse/i,
    });
    if (await other.isVisible().catch(() => false)) {
      await other.click();
    }

    const googleBtn = page.getByRole("button", {
      name: /Continuer avec Google/i,
    });
    await expect(googleBtn).toBeVisible();
    await expect(googleBtn).toBeEnabled();
    await googleBtn.focus();
    await expect(googleBtn).toBeFocused();

    // Clique : état pending (disabled) ou toast d’erreur lisible si provider non prêt.
    await googleBtn.click();
    const pendingOrError = await Promise.race([
      googleBtn
        .isDisabled()
        .then((v) => v)
        .catch(() => false),
      page
        .getByRole("button", { name: /Redirection vers Google/i })
        .isVisible()
        .catch(() => false),
      page
        .locator("[data-sonner-toast]")
        .first()
        .isVisible({ timeout: 5_000 })
        .catch(() => false),
    ]);
    expect(pendingOrError).toBeTruthy();
  });

  test("aucun secret Google exposé dans la page", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const html = await page.content();
    expect(html.toLowerCase()).not.toContain("client_secret");
    expect(html).not.toMatch(/GOOGLE_CLIENT_SECRET/i);
  });
});
