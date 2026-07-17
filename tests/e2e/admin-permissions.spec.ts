import { expect, test } from "@playwright/test";

/**
 * Les tests de permissions avec un vrai compte nécessitent des credentials
 * d’environnement (AFD_E2E_ADMIN_EMAIL / AFD_E2E_ADMIN_PASSWORD).
 * Sans credentials : on vérifie uniquement le refus d’accès anonyme.
 */
test.describe("Permissions admin", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1440",
      "Exécuté uniquement sur desktop-1440",
    );
  });

  test("utilisateur anonyme ne voit pas le dashboard", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL(/\/connexion/);
    await expect(
      page.getByRole("heading", { name: /administration plateforme-afd/i }),
    ).toBeVisible();
  });

  test("connexion réelle si credentials e2e fournis", async ({ page }) => {
    const email = process.env.AFD_E2E_ADMIN_EMAIL;
    const password = process.env.AFD_E2E_ADMIN_PASSWORD;
    test.skip(!email || !password, "Credentials e2e admin non configurés");

    await page.goto("/connexion");
    await page.locator('input[type="email"]').fill(email!);
    await page.locator('input[type="password"]').fill(password!);
    await page.getByRole("button", { name: /se connecter|connexion/i }).click();
    await page.waitForURL(/\/admin/, { timeout: 20000 });
    await expect(
      page.getByRole("heading", { name: /tableau de bord/i }).first(),
    ).toBeVisible();

    // Déconnexion
    await page.getByRole("button", { name: /directrice|administrateur|menu/i }).first().click().catch(() => undefined);
    const logout = page.getByRole("button", { name: /déconnexion/i });
    if (await logout.isVisible().catch(() => false)) {
      await logout.click();
      await page.waitForURL(/\/connexion/);
    }
  });
});
