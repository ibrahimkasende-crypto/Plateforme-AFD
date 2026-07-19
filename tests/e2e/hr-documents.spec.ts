import { expect, test } from "@playwright/test";
import { loginAsAdmin, skipWithoutAdminCredentials } from "./helpers/admin-auth";

test.describe("RH documents", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("page documents RH", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/rh/documents");
    await expect(page).not.toHaveURL(/\/connexion/);
  });
});
