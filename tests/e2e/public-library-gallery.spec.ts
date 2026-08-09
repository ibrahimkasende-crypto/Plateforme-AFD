import { expect, test } from "@playwright/test";

test.describe("Bibliothèque galerie", () => {
  test("photothèque charge sans erreur", async ({ page }) => {
    const response = await page.goto("/bibliotheque/phototheque", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBeLessThan(400);
    await expect(
      page.getByRole("heading", { name: /Photothèque/i }),
    ).toBeVisible();
  });
});
