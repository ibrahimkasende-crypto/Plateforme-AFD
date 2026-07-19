import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Top 5 projets navigation", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("les liens Top 5 n’ouvrent pas /analyse cassée", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    const links = page.locator('a[href*="/admin/projets"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 8); i++) {
      const href = await links.nth(i).getAttribute("href");
      if (!href) continue;
      expect(href).not.toMatch(/\/admin\/projets\/demo-/);
      expect(href).not.toMatch(/\/admin\/projets\/[^/]+\/analyse$/);
    }
  });
});
