import { expect, test } from "@playwright/test";

test.describe("Newsletter Google — mobile", () => {
  test("fenêtre newsletter utilisable sans débordement horizontal", async ({
    page,
  }, testInfo) => {
    test.skip(
      !testInfo.project.name.startsWith("mobile"),
      "Réservé aux viewports mobiles",
    );

    await page.addInitScript(() => {
      try {
        sessionStorage.clear();
        localStorage.removeItem("afd_newsletter_subscribed");
        localStorage.removeItem("afd_newsletter_dismissed_at");
      } catch {
        // ignore
      }
    });

    await page.goto("/?newsletter=google-success");
    const dialog = page.locator('[role="dialog"]').first();
    await expect(dialog).toBeVisible({ timeout: 15_000 });

    const box = await dialog.boundingBox();
    const viewport = page.viewportSize();
    expect(box).toBeTruthy();
    expect(viewport).toBeTruthy();
    if (box && viewport) {
      expect(box.width).toBeLessThanOrEqual(viewport.width + 2);
      expect(box.x).toBeGreaterThanOrEqual(-1);
    }

    const googleBtn = page.getByRole("button", {
      name: /Continuer avec Google|Confirmer mon inscription|S’inscrire avec mon e-mail/i,
    });
    await expect(googleBtn.first()).toBeVisible();
  });
});
