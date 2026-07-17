import { expect, test } from "@playwright/test";

test.describe("Authentification admin", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1440",
      "Exécuté uniquement sur desktop-1440",
    );
  });

  test("page de connexion accessible", async ({ page }) => {
    const response = await page.goto("/connexion");
    expect(response?.status()).toBeLessThan(400);
    await expect(
      page.getByRole("heading", { name: /administration plateforme-afd/i }),
    ).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(
      page.getByRole("link", { name: /mot de passe oublié/i }),
    ).toBeVisible();
  });

  test("mauvais identifiants affichent une erreur propre", async ({ page }) => {
    await page.goto("/connexion");
    await page.locator('input[type="email"]').fill("inconnu@exemple.org");
    await page.locator('input[type="password"]').fill("motdepasseincorrect");
    await page.getByRole("button", { name: /se connecter|connexion/i }).click();
    await expect(
      page.getByText(/identifiants incorrects|compte inaccessible|vérifier/i).first(),
    ).toBeVisible({ timeout: 15000 });
  });

  test("récupération du mot de passe accessible", async ({ page }) => {
    await page.goto("/mot-de-passe-oublie");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await page.locator('input[type="email"]').fill("test@exemple.org");
    await page.getByRole("button", { name: /envoyer|réinitialis/i }).click();
    await expect(
      page.getByText(/e-mail|envoyé|si un compte/i).first(),
    ).toBeVisible({ timeout: 15000 });
  });

  test("page nouveau mot de passe existe", async ({ page }) => {
    const response = await page.goto("/nouveau-mot-de-passe");
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test("page accès refusé existe", async ({ page }) => {
    await page.goto("/acces-refuse?raison=profil");
    await expect(page.getByText(/accès refusé|profil|autoris/i).first()).toBeVisible();
  });
});
