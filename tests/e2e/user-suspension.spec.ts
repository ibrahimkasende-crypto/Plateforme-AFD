import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Suspension compte", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("fiche utilisateur propose contrôle actif", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/utilisateurs");
    await expect(page).not.toHaveURL(/\/connexion/);
    const firstLink = page.locator('a[href^="/admin/utilisateurs/"]').first();
    if ((await firstLink.count()) === 0) {
      test.skip(true, "Aucun utilisateur listé");
    }
    await firstLink.click();
    await page.getByRole("button", { name: /Rôle et permissions/i }).click();
    await expect(page.getByText(/Compte actif/i)).toBeVisible();
  });
});
