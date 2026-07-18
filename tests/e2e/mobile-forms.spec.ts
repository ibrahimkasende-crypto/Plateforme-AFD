import { expect, test } from "@playwright/test";

test.describe("Formulaires mobiles", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("afd_newsletter_seen_session", "true");
      window.sessionStorage.setItem("afd_loader_seen", "true");
      document.cookie =
        "afd_newsletter_subscribed=true; path=/; max-age=31536000";
    });
  });

  test("contact — champs pleine largeur et texte ≥ 16px", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "domcontentloaded" });
    const email = page.locator('input[type="email"]').first();
    await expect(email).toBeVisible();
    const fontSize = await email.evaluate((el) =>
      Number.parseFloat(getComputedStyle(el).fontSize),
    );
    expect(fontSize).toBeGreaterThanOrEqual(16);
    const width = await email.evaluate((el) => el.getBoundingClientRect().width);
    expect(width).toBeGreaterThan(240);
  });

  test("filtres opportunités — drawer mobile", async ({ page }) => {
    await page.goto("/ressources/opportunites", {
      waitUntil: "domcontentloaded",
    });
    const openFilters = page.getByRole("button", {
      name: /Filtres opportunités/i,
    });
    await expect(openFilters).toBeVisible();
    await openFilters.click();
    await expect(page.getByRole("dialog", { name: /Filtres/i })).toBeVisible();
  });
});
