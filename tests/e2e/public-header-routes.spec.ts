import { expect, test } from "@playwright/test";

const headerRoutes = [
  "/",
  "/qui-sommes-nous",
  "/qui-sommes-nous/histoire",
  "/qui-sommes-nous/mission-vision-valeurs",
  "/qui-sommes-nous/gouvernance",
  "/qui-sommes-nous/equipe",
  "/qui-sommes-nous/organigramme",
  "/qui-sommes-nous/politiques-engagements",
  "/actions",
  "/actions/domaines-intervention",
  "/actions/programmes",
  "/actions/projets",
  "/actions/urgences",
  "/actions/zones-intervention",
  "/actions/clusters",
  "/impact",
  "/impact/resultats",
  "/impact/histoires",
  "/impact/temoignages",
  "/impact/rapports",
  "/actualites",
  "/ressources",
  "/ressources/mediatheque",
  "/ressources/documents",
  "/ressources/appels-offres",
  "/ressources/opportunites",
  "/ressources/newsletter",
  "/contact",
  "/adhesion",
  "/partenariat",
  "/soutenir",
  "/rejoindre-equipe",
  "/recherche",
  "/mentions-legales",
  "/politique-confidentialite",
];

const forbidden = [
  /module en préparation/i,
  /page en préparation/i,
  /bientôt disponible/i,
  /coming soon/i,
  /under construction/i,
];

test.describe("Routes header publiques", () => {
  for (const route of headerRoutes) {
    test(`charge ${route} sans placeholder`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBeLessThan(400);
      const body = await page.locator("body").innerText();
      for (const pattern of forbidden) {
        expect(body).not.toMatch(pattern);
      }
    });
  }
});
