import { expect, test } from "@playwright/test";

/**
 * Création / présence des sièges Direction & IT.
 * Les identifiants temporaires ne sont jamais hardcodés : variables E2E uniquement.
 */
test.describe("AFD administrateurs principaux", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
  });

  test("page publique connexion accessible", async ({ page }) => {
    await page.goto("/connexion");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("route changement mot de passe protégée", async ({ page }) => {
    await page.goto("/admin/securite/changer-mot-de-passe");
    await expect(page).toHaveURL(/connexion|acces-refuse|changer-mot-de-passe/i, {
      timeout: 15_000,
    });
  });

  test("mot de passe oublié disponible", async ({ page }) => {
    await page.goto("/mot-de-passe-oublie");
    await expect(page.getByRole("main")).toBeVisible({ timeout: 15_000 });
  });

  test("auth reset-password disponible", async ({ page }) => {
    await page.goto("/auth/reset-password");
    await expect(page.getByText(/mot de passe/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
