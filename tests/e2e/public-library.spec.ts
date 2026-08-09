import { expect, test } from "@playwright/test";

test.describe("Bibliothèque publique", () => {
  test("lien visible dans le header et page accessible", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const link = page.getByRole("navigation").getByRole("link", {
      name: "Bibliothèque",
    });
    await expect(link.first()).toBeVisible();
    await link.first().click();
    await expect(page).toHaveURL(/\/bibliotheque/);
    await expect(
      page.getByRole("heading", { name: /Bibliothèque institutionnelle/i }),
    ).toBeVisible();
  });

  test("routes secondaires accessibles", async ({ page }) => {
    for (const route of [
      "/bibliotheque",
      "/bibliotheque/archives",
      "/bibliotheque/phototheque",
      "/bibliotheque/videotheque",
      "/bibliotheque/rapports",
      "/bibliotheque/documents",
    ]) {
      const response = await page.goto(route, {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBeLessThan(400);
      const body = await page.locator("body").innerText();
      expect(body).not.toMatch(/en cours de développement/i);
      expect(body).not.toMatch(/coming soon/i);
    }
  });
});
