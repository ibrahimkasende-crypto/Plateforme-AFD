import { expect, test, type Page } from "@playwright/test";

const WIDTHS = [
  320, 360, 375, 390, 430, 768, 820, 912, 1024, 1100, 1180, 1280, 1366, 1440,
  1600,
] as const;

async function gotoHome(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("site-header")).toBeVisible();
}

test.describe("Header public — responsive", () => {
  for (const width of WIDTHS) {
    test(`pas de scroll horizontal à ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await gotoHome(page);

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth > doc.clientWidth + 1;
      });
      expect(overflow).toBe(false);
    });
  }

  test("menu mobile sous 1280, desktop à partir de 1280", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 900 });
    await gotoHome(page);
    await expect(page.getByTestId("mobile-menu-trigger")).toBeVisible();
    await expect(page.getByTestId("desktop-navigation")).toBeHidden();

    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoHome(page);
    await expect(page.getByTestId("desktop-navigation")).toBeVisible();
    await expect(page.getByTestId("mobile-menu-trigger")).toBeHidden();
  });

  test("menu Plus visible en compact, masqué en full", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await gotoHome(page);
    await expect(page.getByTestId("nav-plus-menu")).toBeVisible();

    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoHome(page);
    await expect(page.getByTestId("nav-plus-menu")).toBeHidden();
  });

  test("marque compact sous 1440, full à 1440+", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoHome(page);
    const brand = page.getByTestId("organization-brand");
    await expect(brand.locator('[data-brand-text="compact"]')).toBeVisible();
    await expect(brand.locator('[data-brand-text="full"]')).toBeHidden();

    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoHome(page);
    await expect(brand.locator('[data-brand-text="full"]')).toBeVisible();
  });
});
