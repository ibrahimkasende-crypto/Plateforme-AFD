import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Invitation utilisateur", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("alias invitations sous utilisateurs", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/utilisateurs/invitations");
    await expect(page).toHaveURL(/\/admin\/invitations/);
  });

  test("pas de mot de passe dans le flux d’invitation", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/invitations");
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
  });
});
