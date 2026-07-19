import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Révocation sessions", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("page sessions sécurité", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/securite/sessions");
    await expect(page).not.toHaveURL(/\/connexion/);
  });
});
