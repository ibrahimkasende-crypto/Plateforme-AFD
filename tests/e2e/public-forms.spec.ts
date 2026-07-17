import { expect, test } from "@playwright/test";

async function dismissOverlays(page: import("@playwright/test").Page) {
  const closeNewsletter = page.getByRole("button", {
    name: /Fermer la newsletter/i,
  });
  if (await closeNewsletter.isVisible().catch(() => false)) {
    await closeNewsletter.click({ force: true });
  }
}

async function preparePage(
  page: import("@playwright/test").Page,
  path: string,
) {
  await page.addInitScript(() => {
    window.sessionStorage.setItem("afd_newsletter_seen_session", "true");
    window.sessionStorage.setItem("afd_loader_seen", "true");
    document.cookie = "afd_newsletter_subscribed=true; path=/; max-age=31536000";
  });
  await page.goto(path);
  await page.waitForLoadState("domcontentloaded");
  await dismissOverlays(page);
}

test.describe("Formulaires publics", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1440",
      "Exécuté uniquement sur desktop-1440",
    );
  });

  test("contact — formulaire invalide bloque l’envoi", async ({ page }) => {
    await preparePage(page, "/contact");
    await page.getByRole("button", { name: /envoyer le message/i }).click();
    await expect(page.locator("form")).toBeVisible();
    await expect(page.getByText(/est requis|obligatoire|invalide/i).first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("adhésion — page et champs essentiels", async ({ page }) => {
    await preparePage(page, "/adhesion");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
    await expect(page.locator('input[name="consent"], input[type="checkbox"]').first()).toBeVisible();
  });

  test("partenariat — page et formulaire", async ({ page }) => {
    await preparePage(page, "/partenariat");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("form")).toBeVisible();
  });

  test("soutenir — parcours sans faux succès paiement", async ({ page }) => {
    await preparePage(page, "/soutenir");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("form")).toBeVisible();
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(/paiement confirmé|paiement réussi|transaction réussie/i);
  });

  test("newsletter — page dédiée", async ({ page }) => {
    await preparePage(page, "/ressources/newsletter");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
  });
});
