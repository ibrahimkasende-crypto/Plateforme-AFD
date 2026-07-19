import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Invitations utilisateurs", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("page invitations accessible", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/invitations");
    await expect(page).not.toHaveURL(/\/connexion/);
  });

  test("formulaire nouvel utilisateur sans champs mot de passe", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/utilisateurs/nouveau");
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
  });
});
