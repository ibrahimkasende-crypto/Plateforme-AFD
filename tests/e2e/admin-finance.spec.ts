import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Admin finances", () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("pages finances", async ({ page }) => {
    await loginAsAdmin(page);
    for (const route of [
      "/admin/finances",
      "/admin/finances/budgets",
      "/admin/finances/depenses",
      "/admin/finances/transactions",
    ]) {
      await page.goto(route);
      await expect(page.getByText(/Module en préparation/i)).toHaveCount(0);
    }
  });
});
