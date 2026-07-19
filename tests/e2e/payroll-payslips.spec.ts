import { expect, test } from "@playwright/test";
import { loginAsAdmin, skipWithoutAdminCredentials } from "./helpers/admin-auth";

test.describe("Paie — bulletins", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("bulletins de paie", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/rh/paie/bulletins");
    await expect(page).not.toHaveURL(/\/connexion/);
  });
});
