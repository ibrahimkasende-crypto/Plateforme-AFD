import { expect, test } from "@playwright/test";

test.describe("Connexion admin — co-branding LISUNGI", () => {
  test("affiche LISUNGI, Lisungi Hub et présence AFD", async ({ page }) => {
    await page.goto("/connexion");
    await expect(
      page.getByRole("heading", { name: /Connexion à LISUNGI/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/Espace de gestion de .*Alliance des Femmes/i),
    ).toBeVisible();
    await expect(page.locator("[data-powered-by-lisungi]")).toContainText(
      /Un produit Lisungi Hub/i,
    );
    await expect(page.locator("[data-auth-product-brand]")).toContainText(
      "LISUNGI",
    );
    await expect(
      page.getByRole("img", { name: /AFD|Alliance des Femmes/i }).first(),
    ).toBeVisible();
  });
});
