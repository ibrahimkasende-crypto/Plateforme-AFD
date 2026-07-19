import { test, expect } from "@playwright/test";

test.describe("Admin OCR upload", () => {
  test("redirige vers connexion sans session", async ({ page }) => {
    await page.goto("/admin/import-intelligent/nouveau");
    await expect(page).toHaveURL(/connexion/);
  });
});
