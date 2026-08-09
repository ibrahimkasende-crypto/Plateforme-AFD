import { expect, test } from "@playwright/test";

test.describe("Candidature Mambasa (offre expirée)", () => {
  test("page postuler inaccessible", async ({ page }) => {
    const response = await page.goto(
      "/ressources/opportunites/chef-de-projet-base-a-mambasa/postuler",
    );
    expect(response?.status()).toBeGreaterThanOrEqual(400);
  });
});
