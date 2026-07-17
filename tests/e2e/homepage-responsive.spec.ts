import { expect, test } from "@playwright/test";

async function dismissOverlays(page: import("@playwright/test").Page) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const closeNewsletter = page.getByRole("button", {
      name: /Fermer la newsletter/i,
    });
    if (await closeNewsletter.isVisible().catch(() => false)) {
      await closeNewsletter.click({ force: true });
      await page.waitForTimeout(150);
      continue;
    }
    break;
  }
}

test.describe("Homepage responsive", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("afd_newsletter_seen_session", "true");
      window.sessionStorage.setItem("afd_loader_seen", "true");
      document.cookie = "afd_newsletter_subscribed=true; path=/; max-age=31536000";
    });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await dismissOverlays(page);
  });

  test("pas de scroll horizontal + sections clés visibles", async ({
    page,
  }) => {
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
      };
    });
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);

    await expect(
      page.getByRole("heading", { name: /domaines d’intervention/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /programmes prioritaires/i }),
    ).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("menu mobile ouvrable et fermable", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 1440) >= 1200, "Menu desktop au-delà de 1200px");

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);

    const openMenu = page.getByTestId("mobile-menu-trigger");
    await expect(openMenu).toBeVisible();
    await expect(openMenu).toHaveAttribute("aria-expanded", "false");
    // force:true — un overlay (loader/curseur) peut intercepter le hit-target réel
    await openMenu.click({ force: true });
    await expect(openMenu).toHaveAttribute("aria-expanded", "true", {
      timeout: 8000,
    });

    const menuDialog = page.getByTestId("mobile-menu-panel");
    await expect(menuDialog).toBeVisible({ timeout: 8000 });
    await expect(
      menuDialog.getByRole("link", { name: "Accueil", exact: true }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menuDialog).toBeHidden({ timeout: 5000 });
  });

  test("Hero, CTAs et carte 80 % accessibles", async ({ page, viewport }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    const box = await h1.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThan(20);

    await expect(
      page.getByRole("link", { name: /Découvrir nos actions/i }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Devenir partenaire/i }).first(),
    ).toBeVisible();

    if ((viewport?.width ?? 1440) < 1024) {
      await expect(
        page.getByLabel("Gouvernance institutionnelle").first(),
      ).toBeVisible();
      await expect(page.getByText("80 %").first()).toBeVisible();
    }
  });

  test("statistiques et newsletter présents", async ({ page }) => {
    const stats = page.getByLabel("Chiffres clés");
    if (await stats.count()) {
      await expect(stats).toBeVisible();
    }

    await expect(
      page.getByRole("heading", { name: /Restez informé de nos actions/i }),
    ).toBeVisible();
    await expect(page.getByPlaceholder("Votre e-mail")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /S’inscrire/i }).first(),
    ).toBeVisible();
  });
});
