import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Unicité Administrateur principal", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("page créer redirige si un principal existe déjà", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/administrateur-principal");
    if (page.url().includes("acces-refuse")) {
      test.skip(true, "Pas super_admin");
    }
    const createBtn = page.getByRole("link", {
      name: /Créer l’Administrateur principal/i,
    });
    if ((await createBtn.count()) === 0) {
      await page.goto("/admin/administrateur-principal/creer");
      await expect(page).toHaveURL(/administrateur-principal/);
      expect(page.url()).not.toContain("/creer");
    } else {
      await expect(createBtn.first()).toBeVisible();
    }
  });
});
