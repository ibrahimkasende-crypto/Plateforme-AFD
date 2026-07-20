import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Admin — identité produit LISUNGI", () => {
  test.beforeEach(({}, testInfo) => {
    skipWithoutAdminCredentials();
    test.skip(
      !["desktop-1440", "desktop-1536"].includes(testInfo.project.name),
      "Desktop",
    );
  });

  test("LISUNGI visible dans le dashboard admin", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    await expect(page.getByText("Bienvenue dans LISUNGI")).toBeVisible();
    await expect(page.locator("[data-powered-by-lisungi]")).toContainText(
      /Lisungi Hub/i,
    );
    await expect(page.locator("[data-admin-sidebar]")).toContainText("LISUNGI");
  });
});
