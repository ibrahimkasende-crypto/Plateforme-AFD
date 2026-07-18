import { expect, test } from "@playwright/test";

test.describe("Login admin — accessibilité", () => {
  test("champs accessibles et reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/connexion");

    await expect(page.getByLabel(/e-?mail|courriel/i).first()).toBeVisible();
    await expect(page.getByLabel(/mot de passe/i).first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /connexion|se connecter/i }),
    ).toBeVisible();

    const canvas = page.locator("canvas[aria-hidden='true']");
    await expect(canvas).toHaveAttribute("aria-hidden", "true");
  });

  test("mauvaise authentification affiche une erreur", async ({ page }) => {
    await page.goto("/connexion");
    await page.getByLabel(/e-?mail|courriel/i).first().fill("wrong@example.com");
    await page.getByLabel(/mot de passe/i).first().fill("bad-password-123");
    await page.getByRole("button", { name: /connexion|se connecter/i }).click();
    await expect(
      page.getByText(/incorrect|invalide|échec|erreur|identifiant/i).first(),
    ).toBeVisible({ timeout: 15000 });
  });

  test("lien mot de passe oublié", async ({ page }) => {
    await page.goto("/connexion");
    const link = page.getByRole("link", { name: /mot de passe oublié/i });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/mot-de-passe-oublie/);
  });
});
