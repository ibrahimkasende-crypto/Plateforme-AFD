import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("AFD — permissions admins principaux", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
  });

  test("super admin voit la page sièges principaux", async ({ page }) => {
    skipWithoutAdminCredentials();
    await loginAsAdmin(page);
    await page.goto("/admin/administrateurs-principaux");
    if (page.url().includes("acces-refuse")) {
      test.skip(true, "Compte E2E sans super_admin");
    }
    await expect(
      page.getByRole("heading", { name: /Administrateurs principaux/i }),
    ).toBeVisible();
    await expect(page.getByText(/Direction/i).first()).toBeVisible();
    await expect(page.getByText(/IT/i).first()).toBeVisible();
  });

  test("page sécurité personnelle accessible après login", async ({ page }) => {
    skipWithoutAdminCredentials();
    await loginAsAdmin(page);
    await page.goto("/admin/mon-profil/securite");
    if (page.url().includes("changer-mot-de-passe")) {
      test.skip(true, "Compte en changement obligatoire");
    }
    await expect(page.getByText(/Modifier mon mot de passe/i)).toBeVisible({
      timeout: 15_000,
    });
  });
});
