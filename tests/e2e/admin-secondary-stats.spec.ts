import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Stats secondaires", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("affiche des valeurs numériques visibles", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    const values = page.locator(".font-display.font-extrabold.tabular-nums");
    await expect(values.first()).toBeVisible();
    const text = (await values.first().textContent())?.trim() ?? "";
    expect(text.length).toBeGreaterThan(0);
  });
});
