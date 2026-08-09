import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Photo de profil", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("page mon-profil accessible pour avatar", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/mon-profil");
    await expect(page).not.toHaveURL(/\/connexion/);
  });
});
