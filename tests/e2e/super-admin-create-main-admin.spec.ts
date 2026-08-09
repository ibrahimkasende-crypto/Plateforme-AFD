import { expect, test } from "@playwright/test";

/**
 * Remplace / complète super-admin-create-main-admin.spec.ts
 */
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Super Admin — créer Administrateur principal", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("écran et formulaire complets", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/administrateur-principal");
    if (page.url().includes("acces-refuse")) {
      test.skip(true, "Pas super_admin");
    }
    await expect(
      page.getByRole("heading", { name: /Administrateur principal/i }),
    ).toBeVisible();
  });
});
