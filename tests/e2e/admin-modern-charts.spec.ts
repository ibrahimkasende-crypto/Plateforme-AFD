import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Graphiques modernes", () => {
  test.beforeEach(() => {
    skipWithoutAdminCredentials();
  });

  test("dashboard expose les graphiques", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    await expect(page.getByText(/Évolution des bénéficiaires/i)).toBeVisible();
    await expect(page.getByText(/Projets par statut/i)).toBeVisible();
  });

  test("page analytique charge ECharts", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/analyse/projets");
    await expect(page.locator("[data-analytics-page]")).toBeVisible();
  });
});
