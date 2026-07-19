import { expect, test, type Page } from "@playwright/test";

async function dismissOverlays(page: Page) {
  const closeNewsletter = page.getByRole("button", {
    name: /Fermer la newsletter/i,
  });
  if (await closeNewsletter.isVisible().catch(() => false)) {
    await closeNewsletter.click({ force: true }).catch(() => undefined);
  }
}

async function assertNoOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
}

const mobileViewports = [
  { width: 320, height: 568 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
] as const;

test.describe("Full public mobile responsive", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("afd_newsletter_seen_session", "true");
      window.sessionStorage.setItem("afd_loader_seen", "true");
      document.cookie =
        "afd_newsletter_subscribed=true; path=/; max-age=31536000";
    });
  });

  for (const vp of mobileViewports) {
    test(`accueil ${vp.width}px — composition mobile sans overflow`, async ({
      page,
      viewport,
    }) => {
      test.skip((viewport?.width ?? 1440) >= 768, "Scénario téléphone");
      await page.setViewportSize(vp);
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await dismissOverlays(page);

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByText("80 %").first()).toBeVisible();
      await expect(
        page.getByRole("region", { name: /indicateurs d’impact/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("region", { name: /domaines d’intervention/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /domaines d’intervention/i }),
      ).toBeVisible();
      await assertNoOverflow(page);
    });
  }

  test("tablette et desktop — pas d’overflow", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) < 768, "Scénario large");
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissOverlays(page);
    await assertNoOverflow(page);
  });
});
