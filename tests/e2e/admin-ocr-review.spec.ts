import { test, expect } from "@playwright/test";

test.describe("Admin OCR review", () => {
  test("hub import intelligent protégé", async ({ page }) => {
    await page.goto("/admin/import-intelligent");
    await expect(page).toHaveURL(/connexion/);
  });
});
