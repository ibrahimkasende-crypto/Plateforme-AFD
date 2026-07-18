import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Dashboard admin — données affichées", () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1440",
      "Exécuté uniquement sur desktop-1440",
    );
    skipWithoutAdminCredentials();
  });

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    await page.waitForLoadState("domcontentloaded");
  });

  test("affiche les six labels KPI", async ({ page }) => {
    const labels = [
      "Personnes touchées",
      "Femmes touchées",
      "Projets actifs",
      "Activités réalisées",
      "Partenaires actifs",
      "Budget dépensé",
    ];
    for (const label of labels) {
      await expect(page.getByText(label, { exact: false }).first()).toBeVisible();
    }
  });

  test("affiche les titres des graphiques principaux", async ({ page }) => {
    await expect(
      page.getByText(/évolution des bénéficiaires/i).first(),
    ).toBeVisible();
    await expect(page.getByText(/projets par statut/i).first()).toBeVisible();
    await expect(page.getByText(/projets par secteur/i).first()).toBeVisible();
    await expect(
      page.getByText(/projets par province/i).first(),
    ).toBeVisible();
    await expect(
      page.getByText(/activités réalisées par mois/i).first(),
    ).toBeVisible();
  });

  test("badge mode présentation global optionnel", async ({ page }) => {
    const demoBadge = page.getByText(/mode présentation/i);
    const count = await demoBadge.count();
    if (count > 0) {
      await expect(demoBadge.first()).toBeVisible();
      await expect(
        page.getByText(/données de démonstration/i),
      ).toHaveCount(0);
    }
  });

  test("section alertes présente", async ({ page }) => {
    await expect(page.getByText(/^alertes$/i).first()).toBeVisible();
    const emptyOrList = page.getByText(
      /aucune alerte|rapport trimestriel|message|projet sans activité|non traité/i,
    );
    await expect(emptyOrList.first()).toBeVisible();
  });

  test("statistiques complémentaires", async ({ page }) => {
    await expect(
      page.getByText(/statistiques complémentaires/i).first(),
    ).toBeVisible();
    const secondaryLabels = [
      /messages non traités/i,
      /adhésions en attente/i,
      /intentions de dons/i,
      /abonnés newsletter/i,
    ];
    let visibleCount = 0;
    for (const pattern of secondaryLabels) {
      if (await page.getByText(pattern).first().isVisible().catch(() => false)) {
        visibleCount += 1;
      }
    }
    expect(visibleCount).toBeGreaterThanOrEqual(2);
  });
});
