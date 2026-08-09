import { expect, test } from "@playwright/test";

test.describe("Rails mobiles", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("classe afd-h-rail autorise pan-y", async ({ page }) => {
    await page.goto("/");
    const touchAction = await page.evaluate(() => {
      const el = document.querySelector(".afd-h-rail");
      if (!el) return null;
      return getComputedStyle(el).touchAction;
    });
    if (touchAction === null) test.skip();
    expect(touchAction).toMatch(/pan-y|manipulation/i);
  });
});
