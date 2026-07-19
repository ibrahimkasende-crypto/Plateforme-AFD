import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Périmètres d'accès", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("page accès admin", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/acces");
    await expect(page).not.toHaveURL(/\/connexion/);
  });
});
