import { expect, test } from "@playwright/test";

test.describe("Bibliothèque archives", () => {
  test("page archives accessible", async ({ page }) => {
    const response = await page.goto("/bibliotheque/archives", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBeLessThan(400);
    await expect(
      page.getByRole("heading", { name: /Archives historiques/i }),
    ).toBeVisible();
  });
});
