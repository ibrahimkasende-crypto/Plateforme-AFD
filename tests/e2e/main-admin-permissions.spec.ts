import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Permissions admin principal", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("page utilisateurs accessible", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/utilisateurs");
    await expect(page).not.toHaveURL(/\/connexion/);
  });

  test("rôles et permissions pages protégées", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/roles");
    await expect(page).not.toHaveURL(/\/connexion/);
    await page.goto("/admin/permissions");
    await expect(page).not.toHaveURL(/\/connexion/);
  });
});
