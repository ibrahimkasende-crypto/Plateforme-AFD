import { expect, test } from "@playwright/test";
import { loginAsAdmin, skipWithoutAdminCredentials } from "./helpers/admin-auth";

test.describe("Paie — reversal", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("module paie accessible pour reversal", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/rh/paie");
    await expect(page).not.toHaveURL(/\/connexion/);
  });
});
