import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Admin — organisation active AFD", () => {
  test.beforeEach(({}, testInfo) => {
    skipWithoutAdminCredentials();
    test.skip(
      !["desktop-1440", "desktop-1536"].includes(testInfo.project.name),
      "Desktop",
    );
  });

  test("AFD affichée comme organisation active", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    await expect(page.locator("[data-organization-identity]")).toContainText(
      /Alliance des Femmes/i,
    );
    await expect(page.locator("[data-organization-identity]")).toContainText(
      /Organisation active/i,
    );
    await expect(page.locator("[data-organization-badge]")).toBeVisible();
  });
});
