import { expect, test } from "@playwright/test";

test.describe("Candidature Mambasa", () => {
  test("parcours postuler accessible", async ({ page }) => {
    await page.goto(
      "/ressources/opportunites/chef-de-projet-base-a-mambasa/postuler",
    );
    await expect(
      page.getByRole("heading", { name: /Postuler/i }),
    ).toBeVisible();
    await expect(page.getByText(/Étape 1\/5/i)).toBeVisible();
    await page.locator("input").first().fill("Test");
  });

  test("validation étape 1", async ({ page }) => {
    await page.goto(
      "/ressources/opportunites/chef-de-projet-base-a-mambasa/postuler",
    );
    await page.getByRole("button", { name: /Continuer/i }).click();
    // toast sonner
    await expect(page.getByText(/Complétez les informations/i)).toBeVisible({
      timeout: 8000,
    });
  });
});
