import { expect, test } from "@playwright/test";

const SAMPLE_ROUTES = [
  "/qui-sommes-nous",
  "/actions/programmes",
  "/actualites",
  "/ressources",
  "/contact",
  "/soutenir",
] as const;

async function dismissOverlays(page: import("@playwright/test").Page) {
  const closeNewsletter = page.getByRole("button", {
    name: /Fermer la newsletter/i,
  });
  if (await closeNewsletter.isVisible().catch(() => false)) {
    await closeNewsletter.click({ force: true });
  }
}

test.describe("Responsive pages publiques", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("afd_newsletter_seen_session", "true");
      window.sessionStorage.setItem("afd_loader_seen", "true");
      document.cookie = "afd_newsletter_subscribed=true; path=/; max-age=31536000";
    });
  });

  for (const route of SAMPLE_ROUTES) {
    test(`${route} — pas de scroll horizontal`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("domcontentloaded");
      await dismissOverlays(page);

      await expect(page.locator("header")).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
        };
      });
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);
    });
  }
});
