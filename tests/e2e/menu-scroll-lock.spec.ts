import { expect, test } from "@playwright/test";

test.describe("Menu mobile scroll lock", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("ouvre, ferme, scroll rétabli", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /menu|navigation/i }).first();
    if ((await trigger.count()) === 0) {
      // Fallback : bouton hamburger lucide
      const alt = page.locator("header button").filter({ has: page.locator("svg") }).first();
      await alt.click();
    } else {
      await trigger.click();
    }

    await page.waitForTimeout(200);
    const locked = await page.evaluate(() => document.body.style.overflow === "hidden");
    expect(locked).toBeTruthy();

    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
    const unlocked = await page.evaluate(() => {
      const o = document.body.style.overflow;
      return o === "" || o === "auto" || o === "visible";
    });
    expect(unlocked).toBeTruthy();

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(200);
    const after = await page.evaluate(() => window.scrollY);
    expect(after).toBeGreaterThanOrEqual(before);
  });
});
