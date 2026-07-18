import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

const FORBIDDEN = [
  /Module en préparation/i,
  /Cette section fait partie de l’architecture validée/i,
  /Bientôt disponible/i,
  /Coming soon/i,
  /Under construction/i,
];

const ROUTES = [
  "/admin",
  "/admin/programmes",
  "/admin/projets",
  "/admin/activites",
  "/admin/zones-intervention",
  "/admin/urgences",
  "/admin/clusters",
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
  "/admin/utilisateurs",
  "/admin/agents",
  "/admin/finances",
  "/admin/finances/budgets",
  "/admin/finances/depenses",
  "/admin/finances/transactions",
  "/admin/rapports",
  "/admin/documents",
  "/admin/rapports/nouveau",
  "/admin/exports",
  "/admin/journal-activite",
  "/admin/securite",
  "/admin/sauvegardes",
  "/admin/systeme",
  "/admin/parametres",
];

test.describe("Admin — toutes les routes sans placeholder", () => {
  test.beforeEach(() => {
    skipWithoutAdminCredentials();
  });

  for (const route of ROUTES) {
    test(`route ${route} sans placeholder`, async ({ page }) => {
      test.skip(
        test.info().project.name !== "desktop-1440",
        "desktop-1440 uniquement",
      );
      await loginAsAdmin(page);
      await page.goto(route);
      await page.waitForLoadState("domcontentloaded");
      const body = await page.locator("body").innerText();
      for (const pattern of FORBIDDEN) {
        expect(body, `${route} contient ${pattern}`).not.toMatch(pattern);
      }
      await expect(page.locator("main, [data-dashboard-overview]").first()).toBeVisible();
    });
  }
});
