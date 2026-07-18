import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Admin utilisateurs", () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("utilisateurs rôles agents", async ({ page }) => {
    await loginAsAdmin(page);
    for (const route of [
      "/admin/utilisateurs",
      "/admin/roles",
      "/admin/agents",
      "/admin/permissions",
    ]) {
      await page.goto(route);
      await expect(page.getByText(/Module en préparation/i)).toHaveCount(0);
    }
  });
});
