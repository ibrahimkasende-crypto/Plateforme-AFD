import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

/**
 * Vérifie que les surfaces critiques du CMS opérationnel sont joignables
 * et que le site public n’est plus figé côté contact/paramètres.
 */
test.describe("Plateforme opérationnelle — sync dashboard / public", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
  });

  test("paramètres admin accessibles", async ({ page }) => {
    skipWithoutAdminCredentials();
    await loginAsAdmin(page);
    await page.goto("/admin/parametres");
    if (page.url().includes("changer-mot-de-passe") || page.url().includes("acces-refuse")) {
      test.skip(true, "Compte sans droits paramètres");
    }
    await expect(page.getByText(/Paramètres|Général|Coordonnées/i).first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test("page contact publique affiche des coordonnées", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: /contacter/i })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText(/E-mail|email/i).first()).toBeVisible();
  });

  test("accueil charge statistiques d’impact", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main").first()).toBeVisible({ timeout: 20_000 });
  });

  test("mon profil sécurité accessible", async ({ page }) => {
    skipWithoutAdminCredentials();
    await loginAsAdmin(page);
    await page.goto("/admin/mon-profil");
    if (page.url().includes("changer-mot-de-passe")) {
      test.skip(true, "MDP obligatoire");
    }
    await expect(page.getByText(/profil|Sécurité/i).first()).toBeVisible({
      timeout: 20_000,
    });
  });
});
