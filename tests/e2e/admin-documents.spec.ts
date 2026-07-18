import { expect, test } from "@playwright/test";

test("les documents admin redirigent sans authentification", async ({ page }) => {
  await page.goto("/admin/documents");
  await page.waitForURL(/\/connexion/);
  await expect(page).toHaveURL(/\/connexion/);
});
