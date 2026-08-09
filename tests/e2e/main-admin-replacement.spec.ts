import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Remplacement Administrateur principal", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("historique accessible au super admin", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/administrateur-principal/historique");
    if (page.url().includes("acces-refuse")) {
      test.skip(true, "Compte e2e sans super_admin");
    }
    await expect(page).not.toHaveURL(/\/connexion/);
  });
});
