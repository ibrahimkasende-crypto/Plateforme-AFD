import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("RBAC admin", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("pages rôles et permissions", async ({ page }) => {
    await loginAsAdmin(page);
    for (const route of ["/admin/roles", "/admin/permissions"]) {
      await page.goto(route);
      await expect(page).not.toHaveURL(/\/connexion/);
    }
  });
});
