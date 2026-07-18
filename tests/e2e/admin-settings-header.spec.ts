import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Admin — Paramètres header", () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("icône Paramètres dans le header", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    const settings = page.getByRole("link", { name: /^paramètres$/i });
    await expect(settings).toBeVisible();
    await settings.click();
    await expect(page).toHaveURL(/\/admin\/parametres/);
    await expect(page.getByText(/paramètres du site/i).first()).toBeVisible();
    await expect(page.getByText(/Module en préparation/i)).toHaveCount(0);
  });
});
