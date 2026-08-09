import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Photo profil employé", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("formulaire nouvel employé affiche la zone photo", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/rh/personnel/nouveau");
    await expect(page).not.toHaveURL(/\/connexion/);
    if (page.url().includes("acces-refuse")) {
      test.skip(true, "Permission RH manquante");
    }
    await expect(page.getByText(/Photo de profil/i)).toBeVisible();
    await expect(page.getByText(/Ajouter une photo/i)).toBeVisible();
  });
});
