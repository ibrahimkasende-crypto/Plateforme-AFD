import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Dashboard admin — densité", () => {
  test.beforeEach(() => {
    skipWithoutAdminCredentials();
  });

  test("1536×1024 : widgets secondaires visibles, pas de photo", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1536, height: 1024 });
    await loginAsAdmin(page);
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    const overview = page.locator("[data-dashboard-overview]");
    await expect(overview).toBeVisible();

    for (const label of [
      /messages non traités/i,
      /adhésions en attente/i,
      /intentions de dons/i,
      /abonnés newsletter/i,
      /documents téléchargés/i,
      /rapports générés/i,
    ]) {
      await expect(page.getByText(label).first()).toBeVisible();
    }

    await expect(
      page.getByRole("link", { name: /voir le site public/i }),
    ).toBeVisible();
    await expect(page.getByText(/réinventer l'avenir/i)).toHaveCount(0);

    const scrollHeight = await overview.evaluate((el) => el.scrollHeight);
    const clientHeight = await overview.evaluate((el) => el.clientHeight);
    expect(scrollHeight).toBeLessThanOrEqual(clientHeight + 24);
  });

  test("1440×900 : densité compacte", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await loginAsAdmin(page);
    await page.goto("/admin");
    await expect(page.getByText(/projets par secteur/i).first()).toBeVisible();
    await expect(page.getByText(/projets par province/i).first()).toBeVisible();
  });
});
