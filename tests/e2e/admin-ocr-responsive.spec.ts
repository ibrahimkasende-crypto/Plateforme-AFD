import { test, expect } from "@playwright/test";

test.describe("Admin OCR responsive", () => {
  test("page login mobile accessible depuis import", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin/import-intelligent");
    await expect(page).toHaveURL(/connexion/);
  });
});
