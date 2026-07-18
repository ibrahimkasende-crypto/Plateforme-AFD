import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Admin opportunités", () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("opportunités candidatures appels", async ({ page }) => {
    await loginAsAdmin(page);
    for (const route of [
      "/admin/opportunites",
      "/admin/candidatures",
      "/admin/appels-offres",
    ]) {
      await page.goto(route);
      await expect(page.getByText(/Module en préparation/i)).toHaveCount(0);
    }
  });
});
