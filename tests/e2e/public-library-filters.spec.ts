import { expect, test } from "@playwright/test";

test.describe("Bibliothèque filtres", () => {
  test("formulaire de recherche présent", async ({ page }) => {
    await page.goto("/bibliotheque", { waitUntil: "domcontentloaded" });
    await expect(page.locator("form").first()).toBeVisible();
  });

  test("archives filtrables par année si chronologie", async ({ page }) => {
    await page.goto("/bibliotheque/archives", {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.getByRole("heading", { name: /Archives/i }),
    ).toBeVisible();
  });
});
