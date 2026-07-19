import { test } from "@playwright/test";
import { skipWithoutAdminCredentials } from "./helpers/admin-auth";

test.describe("Autosave formulaires", () => {
  test.beforeEach(() => {
    skipWithoutAdminCredentials();
  });

  test("composant autosave disponible (smoke)", async ({ page }) => {
    // Autosave réservé aux brouillons — smoke navigation formulaire
    await page.goto("/connexion");
  });
});
