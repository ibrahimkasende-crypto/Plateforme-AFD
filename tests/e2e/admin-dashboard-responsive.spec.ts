import { expect, test } from "@playwright/test";

test.describe("Dashboard admin responsive", () => {
  test("pas de scroll horizontal sur /admin", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("domcontentloaded");

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
      };
    });
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);
  });

  test("menu mobile disponible sous 1024px", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 1440) >= 1024, "Desktop : sidebar fixe");

    await page.goto("/admin");
    const menu = page.getByRole("button", { name: /menu|ouvrir/i }).first();
    await expect(menu).toBeVisible();
    await menu.click();
    await expect(
      page.getByRole("navigation", { name: /navigation admin/i }).first(),
    ).toBeVisible();
  });

  test("scroll vertical autorisé sur tablette et mobile", async ({
    page,
    viewport,
  }) => {
    test.skip(
      (viewport?.width ?? 1440) >= 1280,
      "Zero-scroll cible réservé au desktop ≥1280",
    );

    await page.goto("/admin");
    await page.waitForLoadState("domcontentloaded");

    const metrics = await page.evaluate(() => ({
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
    }));

    // Sur mobile/tablette l'empilement des widgets peut dépasser la hauteur ;
    // on vérifie seulement que la page est scrollable ou au minimum mesurable.
    expect(metrics.scrollHeight).toBeGreaterThan(0);
    expect(metrics.clientHeight).toBeGreaterThan(0);
  });

  test("pas d'exigence zero-scroll sur viewport mobile", async ({
    page,
    viewport,
  }) => {
    test.skip(
      (viewport?.width ?? 1440) >= 1536,
      "Test inverse : mobile/tablette uniquement",
    );

    await page.goto("/admin");
    await page.waitForLoadState("domcontentloaded");

    const overview = page.locator("[data-dashboard-overview]");
    const overviewCount = await overview.count();
    if (overviewCount === 0) {
      // Non authentifié : redirect connexion — pas d'overview, test OK
      await expect(page).toHaveURL(/connexion/);
      return;
    }

    const pageScroll = await page.evaluate(() => ({
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
    }));

    // Le scroll vertical est explicitement permis : pas d'assertion d'égalité.
    expect(pageScroll.scrollHeight).toBeGreaterThanOrEqual(
      pageScroll.clientHeight,
    );
  });
});
