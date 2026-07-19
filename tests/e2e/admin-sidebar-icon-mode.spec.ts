import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Sidebar icônes réduites", () => {
  test.beforeEach(() => {
    skipWithoutAdminCredentials();
  });

  test("mode réduit et site public", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    const toggle = page.getByRole("button", {
      name: /Réduire la barre latérale|Ouvrir la barre latérale/i,
    });
    await toggle.first().click();
    await expect(page.locator('[data-admin-sidebar][data-collapsed="true"]')).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator("[data-admin-public-site]")).toBeVisible();
  });
});
