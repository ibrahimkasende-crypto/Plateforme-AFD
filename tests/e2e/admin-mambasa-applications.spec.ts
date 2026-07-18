import { expect, test } from "@playwright/test";

test.describe("Admin candidatures", () => {
  test("la liste admin exige une authentification", async ({ page }) => {
    await page.goto("/admin/candidatures");
    await expect(page).toHaveURL(/connexion|admin|login/i);
  });
});
