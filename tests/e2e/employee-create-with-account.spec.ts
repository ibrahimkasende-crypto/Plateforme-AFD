import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Employé avec compte", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("activer le compte affiche rôle et bouton invitation", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/rh/personnel/nouveau");
    if (page.url().includes("acces-refuse")) {
      test.skip(true, "Permission RH manquante");
    }
    await page
      .getByRole("checkbox", { name: /Créer également un compte/i })
      .check();
    await expect(page.getByText(/Rôle \*/i)).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: /Créer l’employé et envoyer l’invitation/i,
      }),
    ).toBeVisible();
  });
});
