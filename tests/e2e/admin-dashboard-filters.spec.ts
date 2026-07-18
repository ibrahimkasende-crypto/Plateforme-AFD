import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Dashboard admin — filtres URL", () => {
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

  test("le select période met à jour period dans l'URL", async ({ page }) => {
    const periodSelect = page.locator('select').filter({ has: page.locator('option[value="30d"]') }).first();
    await expect(periodSelect).toBeVisible();
    await periodSelect.selectOption("30d");
    await expect(page).toHaveURL(/period=30d/);
  });

  test("le select programme met à jour programme dans l'URL", async ({ page }) => {
    const programmeSelect = page
      .locator("label")
      .filter({ hasText: /^programme$/i })
      .locator("select");
    await expect(programmeSelect).toBeVisible();

    const options = programmeSelect.locator("option[value]:not([value=''])");
    const optionCount = await options.count();
    test.skip(optionCount === 0, "Aucun programme disponible dans les filtres");

    const programmeId = await options.first().getAttribute("value");
    expect(programmeId).toBeTruthy();
    await programmeSelect.selectOption(programmeId!);
    await expect(page).toHaveURL(new RegExp(`programme=${programmeId}`));
  });

  test("réinitialiser programme retire le paramètre", async ({ page }) => {
    const programmeSelect = page
      .locator("label")
      .filter({ hasText: /^programme$/i })
      .locator("select");
    const options = programmeSelect.locator("option[value]:not([value=''])");
    const optionCount = await options.count();
    test.skip(optionCount === 0, "Aucun programme disponible");

    const programmeId = await options.first().getAttribute("value");
    await programmeSelect.selectOption(programmeId!);
    await expect(page).toHaveURL(/programme=/);

    await programmeSelect.selectOption("");
    await expect(page).not.toHaveURL(/programme=/);
  });
});
