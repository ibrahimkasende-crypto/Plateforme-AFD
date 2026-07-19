import { test, expect } from "@playwright/test";

test.describe("Admin OCR processing", () => {
  test("file d’attente protégée", async ({ page }) => {
    await page.goto("/admin/import-intelligent/file-attente");
    await expect(page).toHaveURL(/connexion|acces-refuse/);
  });
});
