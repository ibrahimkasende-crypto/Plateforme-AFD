import { expect, test } from "@playwright/test";
import { loginAsAdmin, skipWithoutAdminCredentials } from "./helpers/admin-auth";

test.describe("RH onboarding", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("recrutement inclut onboarding", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/rh/onboarding");
    await expect(page).not.toHaveURL(/\/connexion/);
  });
});
