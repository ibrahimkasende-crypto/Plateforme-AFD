import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Messages admin", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("page messages et badge header", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    await expect(page.getByRole("link", { name: /Messages|message/i })).toBeVisible();
    await page.goto("/admin/messages");
    await expect(page.getByRole("heading", { name: "Messages" })).toBeVisible();
  });
});
