import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Dashboard admin — layout 1536×1024", () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1536",
      "Exécuté uniquement sur desktop-1536",
    );
    skipWithoutAdminCredentials();
  });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1536, height: 1024 });
    await loginAsAdmin(page);
    await page.goto("/admin");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("[data-dashboard-overview]")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("overview tient dans le viewport sans scroll vertical page", async ({
    page,
  }) => {
    const dashboardMetrics = await page.evaluate(() => {
      const root = document.querySelector("[data-dashboard-overview]");
      if (!root) return null;
      return {
        viewportHeight: window.innerHeight,
        top: root.getBoundingClientRect().top,
        bottom: root.getBoundingClientRect().bottom,
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: document.documentElement.clientHeight,
      };
    });
    expect(dashboardMetrics).not.toBeNull();
    expect(dashboardMetrics!.bottom).toBeLessThanOrEqual(
      dashboardMetrics!.viewportHeight + 1,
    );
    expect(dashboardMetrics!.scrollHeight).toBeLessThanOrEqual(
      dashboardMetrics!.clientHeight + 1,
    );
  });

  test("six KPI, titres graphiques et sidebar visibles", async ({ page }) => {
    const kpiLabels = [
      /personnes touchées/i,
      /femmes touchées/i,
      /projets actifs/i,
      /activités réalisées/i,
      /partenaires actifs/i,
      /budget dépensé/i,
    ];
    for (const label of kpiLabels) {
      await expect(page.getByText(label).first()).toBeVisible();
    }

    const chartTitles = [
      /évolution des bénéficiaires/i,
      /projets par statut/i,
      /projets par secteur/i,
      /bénéficiaires par province/i,
      /activités réalisées par mois/i,
    ];
    for (const title of chartTitles) {
      await expect(page.getByText(title).first()).toBeVisible();
    }

    await expect(
      page.getByRole("navigation", { name: /navigation admin/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /tableau de bord/i }).first(),
    ).toBeVisible();
  });

  test("pas de scroll horizontal", async ({ page }) => {
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);
  });

  test("capture visuelle optionnelle", async ({ page }) => {
    test.skip(
      process.env.AFD_E2E_CAPTURE_VISUAL !== "true",
      "Définir AFD_E2E_CAPTURE_VISUAL=true pour générer la capture",
    );
    await page.screenshot({
      path: "tests/visual/admin-dashboard-1536x1024.png",
      fullPage: false,
    });
  });
});
