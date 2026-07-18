import { expect, test, type Page } from "@playwright/test";

async function assertNoOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
}

const routes = [
  "/",
  "/qui-sommes-nous",
  "/actions",
  "/actions/domaines-intervention",
  "/actualites",
  "/impact",
  "/ressources/documents",
  "/ressources/opportunites",
  "/partenaires",
  "/contact",
  "/mentions-legales",
] as const;

test.describe("Overflow mobile — routes publiques", () => {
  test.use({ viewport: { width: 320, height: 568 } });
  test.describe.configure({ timeout: 120_000 });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("afd_newsletter_seen_session", "true");
      window.sessionStorage.setItem("afd_loader_seen", "true");
      document.cookie =
        "afd_newsletter_subscribed=true; path=/; max-age=31536000";
    });
  });

  for (const route of routes) {
    test(`${route} sans scroll horizontal global`, async ({ page }) => {
      await page.goto(route, {
        waitUntil: "domcontentloaded",
        timeout: 45_000,
      });
      await assertNoOverflow(page);
    });
  }
});
