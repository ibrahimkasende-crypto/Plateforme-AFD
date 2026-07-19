import { test, expect } from "@playwright/test";

test.describe("Admin OCR approval", () => {
  test("modèles protégés", async ({ page }) => {
    await page.goto("/admin/import-intelligent/modeles");
    await expect(page).toHaveURL(/connexion|acces-refuse/);
  });
});
