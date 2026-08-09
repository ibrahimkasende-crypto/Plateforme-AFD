import { expect, test } from "@playwright/test";

test.describe("Connexion admin — identité AFD", () => {
  test("affiche la connexion AFD", async ({ page }) => {
    await page.goto("/connexion");
    await expect(
      page.getByRole("heading", { name: /Connexion AFD ASBL/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/Espace de gestion de .*Alliance des Femmes/i),
    ).toBeVisible();
    await expect(page.locator("[data-afd-platform-brand]")).toContainText(
      /Plateforme officielle AFD/i,
    );
    await expect(page.locator("[data-auth-product-brand]")).toContainText(
      "AFD",
    );
    await expect(
      page.getByRole("img", { name: /AFD|Alliance des Femmes/i }).first(),
    ).toBeVisible();
  });
});
