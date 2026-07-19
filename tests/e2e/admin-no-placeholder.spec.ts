import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

/**
 * Garde anti-placeholder — Vague 0.
 * Vérifie l’absence de textes stub sur les routes admin critiques,
 * y compris RH / IAM / OCR ajoutés après l’inventaire historique.
 */
const FORBIDDEN = [
  /Module en préparation/i,
  /Page en préparation/i,
  /Cette section fait partie de l’architecture validée/i,
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
  "/admin/rh/departements",
  "/admin/rh/recrutement",
  "/admin/rh/presences",
  "/admin/rh/conges",
  "/admin/rh/performance",
  "/admin/rh/formations",
  "/admin/rh/paie",
  "/admin/utilisateurs",
  "/admin/invitations",
  "/admin/acces",
  "/admin/agents",
  "/admin/finances",
  "/admin/finances/budgets",
  "/admin/finances/depenses",
  "/admin/finances/transactions",
  "/admin/rapports",
  "/admin/documents",
  "/admin/import-intelligent",
  "/admin/rapports/nouveau",
  "/admin/exports",
  "/admin/journal-activite",
  "/admin/securite",
  "/admin/securite/sessions",
  "/admin/mon-profil",
  "/admin/sauvegardes",
  "/admin/systeme",
];

test.describe("Admin — aucune route avec placeholder", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1440",
      "Exécuté uniquement sur desktop-1440",
    );
    skipWithoutAdminCredentials();
  });

  for (const route of ROUTES) {
    test(`pas de placeholder sur ${route}`, async ({ page }) => {
      await loginAsAdmin(page);
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status() ?? 0).toBeLessThan(400);

      const body = await page.locator("body").innerText();
      for (const pattern of FORBIDDEN) {
        expect(body, `Texte interdit ${pattern} sur ${route}`).not.toMatch(
          pattern,
        );
      }
    });
  }
});
