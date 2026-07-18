import { expect, test } from "@playwright/test";

test("les opportunités admin redirigent sans authentification", async ({ page }) => {
  await page.goto("/admin/opportunites");
  await page.waitForURL(/\/connexion/);
  await expect(page).toHaveURL(/\/connexion/);
});
