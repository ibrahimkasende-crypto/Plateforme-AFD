import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Journal audit", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("journal activité admin", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/journal-activite");
    await expect(page).not.toHaveURL(/\/connexion/);
  });
});
