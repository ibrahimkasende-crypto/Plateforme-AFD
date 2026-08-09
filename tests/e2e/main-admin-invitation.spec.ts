import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Invitation Administrateur principal", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("formulaire création sans mot de passe, rôle imposé", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/administrateur-principal/creer");
    if (
      page.url().includes("acces-refuse") ||
      !page.url().includes("/creer")
    ) {
      test.skip(true, "Création indisponible");
    }
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
    await expect(page.locator('input[name="role"]')).toHaveAttribute(
      "value",
      "admin_principal",
    );
    await expect(page.getByText(/Photo/i).first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Créer et envoyer l’invitation/i }),
    ).toBeVisible();
  });
});
