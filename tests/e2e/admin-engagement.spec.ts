import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Admin engagement", () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("messages adhésions dons", async ({ page }) => {
    await loginAsAdmin(page);
    for (const route of ["/admin/messages", "/admin/adhesions", "/admin/dons"]) {
      await page.goto(route);
      await expect(page.getByText(/Module en préparation/i)).toHaveCount(0);
      await expect(page.locator("main")).toBeVisible();
    }
  });
});
