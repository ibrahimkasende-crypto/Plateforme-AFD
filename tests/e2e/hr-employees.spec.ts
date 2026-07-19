import { expect, test } from "@playwright/test";
import { loginAsAdmin, skipWithoutAdminCredentials } from "./helpers/admin-auth";

test.describe("RH employés", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("liste personnel", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/rh/personnel");
    await expect(page).not.toHaveURL(/\/connexion/);
  });
});
