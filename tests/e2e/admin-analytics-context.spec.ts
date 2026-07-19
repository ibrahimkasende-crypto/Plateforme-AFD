import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Contexte analytique", () => {
  test.beforeEach(() => {
    skipWithoutAdminCredentials();
  });

  test("conserve les paramètres et retourne au dashboard", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto(
      "/admin/analyse/projets?period=year&statut=actif&sourceWidget=kpi-projets",
    );
    await expect(page).toHaveURL(/statut=actif/);
    await page.getByRole("link", { name: /Retour au tableau de bord/i }).click();
    await expect(page).toHaveURL(/\/admin/);
  });
});
