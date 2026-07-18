import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Admin responsive", () => {
  test.beforeEach(() => {
    skipWithoutAdminCredentials();
  });

  test("mobile drawer navigation", async ({ page }) => {
    test.skip(test.info().project.name !== "mobile-390", "mobile-390");
    await loginAsAdmin(page);
    await page.goto("/admin");
    await page.getByRole("button", { name: /ouvrir le menu/i }).click();
    await expect(page.getByLabel(/navigation|menu/i).first()).toBeVisible();
  });
});
