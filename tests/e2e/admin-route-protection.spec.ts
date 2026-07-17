import { expect, test } from "@playwright/test";

test.describe("Protection des routes admin", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1440",
      "Exécuté uniquement sur desktop-1440",
    );
  });

  test("accès direct à /admin redirige vers /connexion", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL(/\/connexion/);
    expect(page.url()).toMatch(/\/connexion/);
    expect(page.url()).toMatch(/next=/);
  });

  test("sous-route admin protégée", async ({ page }) => {
    await page.goto("/admin/programmes");
    await page.waitForURL(/\/connexion/);
    expect(page.url()).toMatch(/\/connexion/);
  });

  test("pas de ModulePlaceholder sur la page connexion", async ({ page }) => {
    await page.goto("/connexion");
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/Module en préparation/i);
  });
});
