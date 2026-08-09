import { expect, test } from "@playwright/test";

test.describe("AFD — réinitialisation mot de passe", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
  });

  test("formulaire mot de passe oublié", async ({ page }) => {
    await page.goto("/mot-de-passe-oublie");
    await expect(page.locator('input[type="email"]').first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("page reset-password affiche les règles", async ({ page }) => {
    await page.goto("/auth/reset-password");
    await expect(page.getByText(/Nouveau mot de passe|mot de passe/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
