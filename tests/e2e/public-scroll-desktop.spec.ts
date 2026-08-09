import { expect, test } from "@playwright/test";

test.describe("Scroll public desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("molette traverse l’accueil", async ({ page }) => {
    await page.goto("/");
    const start = await page.evaluate(() => window.scrollY);
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel(0, 600);
    }
    await page.waitForTimeout(400);
    const end = await page.evaluate(() => window.scrollY);
    expect(end).toBeGreaterThan(start + 200);
  });

  test("pas de débordement horizontal", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth + 2;
    });
    expect(overflow).toBeFalsy();
  });
});
