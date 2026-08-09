import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Admin principal — création agent", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("formulaire multi-étapes sans mot de passe", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/utilisateurs/nouveau");
    await expect(page).not.toHaveURL(/\/connexion/);
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
    await expect(page.getByText(/1\.\s*Identité/i)).toBeVisible();
  });

  test("étapes Suivant du wizard", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/utilisateurs/nouveau");
    await page.getByLabel(/Prénom/i).fill("Test");
    await page.getByLabel(/^Nom \*/i).fill("Agent");
    await page.getByRole("button", { name: /Suivant/i }).click();
    await expect(page.getByText(/E-mail professionnel/i)).toBeVisible();
  });
});
