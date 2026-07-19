import { expect, test } from "@playwright/test";
import { loginAsAdmin, skipWithoutAdminCredentials } from "./helpers/admin-auth";

test.describe("RH présences", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("page présences", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/rh/presences");
    await expect(page).not.toHaveURL(/\/connexion/);
  });
});
