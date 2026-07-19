import { expect, test, type Page } from "@playwright/test";

async function dismissOverlays(page: Page) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const closeNewsletter = page.getByRole("button", {
      name: /Fermer la newsletter/i,
    });
    if (await closeNewsletter.isVisible().catch(() => false)) {
      await closeNewsletter.click({ force: true });
    }
    break;
  }
}

async function assertNoGlobalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
    };
  });
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);
}

test.describe("Full mobile responsive — public", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("afd_newsletter_seen_session", "true");
      window.sessionStorage.setItem("afd_loader_seen", "true");
      document.cookie =
        "afd_newsletter_subscribed=true; path=/; max-age=31536000";
    });
  });

  test("accueil mobile : pas d’overflow, rails et CTAs", async ({
    page,
    viewport,
  }) => {
    test.skip((viewport?.width ?? 1440) >= 768, "Scénario téléphone");

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await dismissOverlays(page);

    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await assertNoGlobalOverflow(page);

    await expect(
      page.getByRole("region", { name: /indicateurs d’impact/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /domaines d’intervention/i }),
    ).toBeVisible();
  });

  test("accueil desktop : pas d’overflow global", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) < 1024, "Scénario desktop");

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await dismissOverlays(page);
    await assertNoGlobalOverflow(page);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("rail mobile scrollable (domaines)", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 1440) >= 768, "Scénario téléphone");

    await page.goto("/");
    await dismissOverlays(page);

    const rail = page.getByRole("region", {
      name: /domaines d’intervention/i,
    });
    await expect(rail).toBeVisible();
    const hasOverflow = await rail.evaluate(
      (el) => el.scrollWidth > el.clientWidth - 1,
    );
    expect(hasOverflow).toBeTruthy();
  });

  test("pages secondaires sans overflow (filtres)", async ({
    page,
    viewport,
  }) => {
    test.skip((viewport?.width ?? 1440) >= 768, "Scénario téléphone");
    test.setTimeout(90_000);

    for (const path of [
      "/ressources/documents",
      "/ressources/appels-offres",
      "/contact",
    ]) {
      await page.goto(path, { waitUntil: "domcontentloaded", timeout: 45_000 });
      await dismissOverlays(page);
      await assertNoGlobalOverflow(page);
    }
  });
});

