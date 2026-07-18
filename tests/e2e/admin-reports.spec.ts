import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Admin rapports", () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("rapports documents exports", async ({ page }) => {
    await loginAsAdmin(page);
    for (const route of [
      "/admin/rapports",
      "/admin/documents",
      "/admin/rapports/nouveau",
      "/admin/exports",
    ]) {
      await page.goto(route);
      await expect(page.getByText(/Module en préparation/i)).toHaveCount(0);
    }
  });
});
