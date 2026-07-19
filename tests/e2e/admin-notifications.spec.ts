import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Notifications admin", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("popover et page notifications", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    await page.getByRole("button", { name: /notification/i }).click();
    await expect(
      page.getByRole("link", { name: /Voir toutes les notifications/i }),
    ).toBeVisible();
    await page.goto("/admin/notifications");
    await expect(page.getByRole("heading", { name: "Notifications" })).toBeVisible();
  });
});
