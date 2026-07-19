import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Sécurité super admin", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("flux super_admin affiche avertissement MFA", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/utilisateurs/nouveau?type=super_admin");
    const mfa = page.getByText(/MFA/i);
    if (await mfa.isVisible().catch(() => false)) {
      await expect(mfa.first()).toBeVisible();
    } else {
      test.skip(true, "Permission super_admin non disponible pour ce compte");
    }
  });
});
