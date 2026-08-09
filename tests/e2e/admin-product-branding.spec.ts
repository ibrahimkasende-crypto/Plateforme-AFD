import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Admin — identité AFD", () => {
  test.beforeEach(({}, testInfo) => {
    skipWithoutAdminCredentials();
    test.skip(
      !["desktop-1440", "desktop-1536"].includes(testInfo.project.name),
      "Desktop",
    );
  });

  test("AFD visible dans le dashboard admin", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    await expect(page.getByText("Tableau de bord AFD")).toBeVisible();
    await expect(page.locator("[data-afd-platform-brand]")).toContainText(
      /Pilotage institutionnel AFD/i,
    );
    await expect(page.locator("[data-admin-sidebar]")).toContainText("AFD");
  });
});
