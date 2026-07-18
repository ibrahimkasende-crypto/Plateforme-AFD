import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Dashboard admin — graphiques secteur / province", () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(
      !["desktop-1440", "desktop-1536"].includes(testInfo.project.name),
      "Desktop uniquement",
    );
    skipWithoutAdminCredentials();
  });

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");
  });

  test("Projets par secteur visible sans NaN", async ({ page }) => {
    await expect(page.getByText(/projets par secteur/i).first()).toBeVisible();
    const panel = page.locator("text=Projets par secteur").locator("..").locator("..");
    await expect(panel).toBeVisible();
    const text = await panel.innerText();
    expect(text).not.toMatch(/\bNaN\b/);
  });

  test("Projets par province visible avec carte RDC", async ({ page }) => {
    await expect(page.getByText(/projets par province/i).first()).toBeVisible();
    await expect(page.locator("[data-rdc-map]")).toBeVisible();
    await expect(page.locator("[data-province-projects-panel]")).toBeVisible();
  });

  test("clic province navigue vers projets filtrés", async ({ page }) => {
    const link = page
      .locator("[data-province-projects-panel] a")
      .first();
    if ((await link.count()) === 0) {
      test.skip(true, "Aucune province cliquable (données absentes)");
    }
    await link.click();
    await expect(page).toHaveURL(/\/admin\/projets\?province=/);
  });

  test("redimensionnement après repli sidebar", async ({ page }) => {
    const logoToggle = page.getByRole("button", {
      name: /réduire la barre latérale|ouvrir la barre latérale/i,
    });
    await expect(logoToggle.first()).toBeVisible();
    const chart = page.getByText(/projets par secteur/i).first();
    const before = await chart.boundingBox();
    await logoToggle.first().click();
    await page.waitForTimeout(300);
    const after = await chart.boundingBox();
    expect(before && after).toBeTruthy();
    if (before && after) {
      expect(after.width).toBeGreaterThan(before.width - 1);
    }
  });
});
