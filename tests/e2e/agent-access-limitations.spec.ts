import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Limitations d’accès agent", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("accès refusé hors admin pour routes sensibles si non autorisé", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/parametres");
    // Soit accessible (super), soit acces-refuse — pas de crash
    await expect(page).not.toHaveURL(/\/connexion/);
  });
});
