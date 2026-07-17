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
});
