import { expect, test } from "@playwright/test";

async function dismissOverlays(page: import("@playwright/test").Page) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const closeNewsletter = page.getByRole("button", {
      name: /Fermer la newsletter/i,
    });
    if (await closeNewsletter.isVisible().catch(() => false)) {
      await closeNewsletter.click({ force: true });
    }
    await page.waitForTimeout(100);
    break;
  }
}

async function gotoPublic(
  page: import("@playwright/test").Page,
  path: string,
) {
  await page.addInitScript(() => {
    window.sessionStorage.setItem("afd_newsletter_seen_session", "true");
    window.sessionStorage.setItem("afd_loader_seen", "true");
    document.cookie = "afd_newsletter_subscribed=true; path=/; max-age=31536000";
  });
  const response = await page.goto(path);
  await page.waitForLoadState("domcontentloaded");
  await dismissOverlays(page);
  return response;
}

const PUBLIC_ROUTES = [
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
  "/recherche",
  "/mentions-legales",
  "/politique-confidentialite",
] as const;

test.describe("Site public — routes", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1440",
      "Exécuté uniquement sur desktop-1440",
    );
  });

  for (const route of PUBLIC_ROUTES) {
    test(`route ${route} répond sans placeholder temporaire`, async ({
      page,
    }) => {
      const response = await gotoPublic(page, route);
      expect(response?.status(), `status ${route}`).toBeLessThan(400);
      await expect(page.locator("header")).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      const bodyText = await page.locator("body").innerText();
      expect(bodyText).not.toMatch(/Module en préparation/i);
      expect(bodyText).not.toMatch(/Cette page est en construction/i);
      expect(bodyText).not.toMatch(/Fonctionnalité prochainement disponible/i);
      expect(bodyText).not.toMatch(/Coming soon/i);
      expect(bodyText).not.toMatch(/Under construction/i);
    });
  }

  test("recherche avec paramètre q", async ({ page }) => {
    const response = await gotoPublic(page, "/recherche?q=afd");
    expect(response?.status()).toBeLessThan(400);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("page inexistante affiche 404 amical", async ({ page }) => {
    const response = await gotoPublic(page, "/page-qui-nexiste-pas-afd-404");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("link", { name: /accueil|contact/i }).first(),
    ).toBeVisible();
  });
});
