import { test, expect } from "@playwright/test";

test.describe("Admin OCR anomalies", () => {
  test("route anomalies protégée", async ({ page }) => {
    await page.goto("/admin/import-intelligent/00000000-0000-0000-0000-000000000000/anomalies");
    await expect(page).toHaveURL(/connexion|acces-refuse|not-found|404/);
  });
});
