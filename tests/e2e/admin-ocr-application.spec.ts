import { test, expect } from "@playwright/test";

test.describe("Admin OCR application", () => {
  test("règles protégées", async ({ page }) => {
    await page.goto("/admin/import-intelligent/regles");
    await expect(page).toHaveURL(/connexion|acces-refuse/);
  });
});
