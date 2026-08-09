import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Employé sans compte", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("option compte désactivée → bouton Créer l’employé", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/rh/personnel/nouveau");
    if (page.url().includes("acces-refuse")) {
      test.skip(true, "Permission RH manquante");
    }
    const checkbox = page.getByRole("checkbox", {
      name: /Créer également un compte/i,
    });
    await expect(checkbox).not.toBeChecked();
    await expect(
      page.getByRole("button", { name: /^Créer l’employé$/i }),
    ).toBeVisible();
  });
});
