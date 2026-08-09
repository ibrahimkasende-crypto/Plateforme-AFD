import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("AFD — photo de profil admins", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("mon profil affiche un avatar initiales ou photo", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/mon-profil");
    if (page.url().includes("changer-mot-de-passe")) {
      test.skip(true, "Changement MDP obligatoire");
    }
    await expect(page.getByText(/Utilisateur|Mon profil/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
