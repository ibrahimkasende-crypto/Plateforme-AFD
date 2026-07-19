import { expect, test } from "@playwright/test";
import { loginAsAdmin, skipWithoutAdminCredentials } from "./helpers/admin-auth";

test.describe("RH formations", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("page formations", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/rh/formations");
    await expect(page).not.toHaveURL(/\/connexion/);
  });
});
