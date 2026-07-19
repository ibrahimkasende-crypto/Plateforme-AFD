import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

/**
 * Anti-placeholder — Vague 0.
 * Vérifie l’absence de libellés interdits sur les routes admin principales.
 */
const FORBIDDEN = [
  /Module en préparation/i,
  /Page en préparation/i,
  /Cette section fait partie de l['’]architecture validée/i,
  /Bientôt disponible/i,
  /Coming soon/i,
  /Under construction/i,
  /Fonctionnalité prochainement disponible/i,
  /Contenu à venir/i,
];

const ROUTES = [
  "/admin",
  "/admin/programmes",
  "/admin/projets",
  "/admin/activites",
  "/admin/zones-intervention",
  "/admin/urgences",
  "/admin/clusters",
  "/admin/stocks",
  "/admin/logistique",
  "/admin/beneficiaires",
  "/admin/indicateurs",
  "/admin/enquetes",
  "/admin/histoires-impact",
  "/admin/temoignages",
  "/admin/actualites",
  "/admin/mediatheque",
  "/admin/newsletter",
  "/admin/publications/pages",
  "/admin/messages",
  "/admin/adhesions",
  "/admin/partenariats",
  "/admin/dons",
  "/admin/opportunites",
  "/admin/candidatures",
  "/admin/appels-offres",
  "/admin/partenaires",
  "/admin/equipe",
  "/admin/rh",
  "/admin/rh/personnel",
  "/admin/utilisateurs",
  "/admin/agents",
  "/admin/finances",
  "/admin/finances/budgets",
  "/admin/rapports",
  "/admin/documents",
  "/admin/import-intelligent",
  "/admin/exports",
  "/admin/journal-activite",
  "/admin/securite",
  "/admin/sauvegardes",
  "/admin/systeme",
  "/admin/mon-profil",
];

test.describe("Anti-placeholder admin", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440 uniquement");
    skipWithoutAdminCredentials();
  });

  for (const route of ROUTES) {
    test(`pas de placeholder sur ${route}`, async ({ page }) => {
      await loginAsAdmin(page);
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status() ?? 0, `HTTP pour ${route}`).toBeLessThan(400);

      const body = await page.locator("body").innerText();
      for (const pattern of FORBIDDEN) {
        expect(body, `${route} contient ${pattern}`).not.toMatch(pattern);
      }

      // Bouton vide / lien dièse grossiers
      const hashLinks = page.locator('a[href="#"]');
      await expect(hashLinks).toHaveCount(0);
    });
  }
});
