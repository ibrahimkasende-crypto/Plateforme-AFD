import { expect, test } from "@playwright/test";

test.describe("Scroll public mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("accueil : défilement du hero au footer", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => window.scrollY);
    expect(after).toBeGreaterThan(before);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator("footer").first()).toBeVisible();
  });

  test("swipe vertical au-dessus d’un rail ne bloque pas", async ({ page }) => {
    await page.goto("/");
    const rail = page.locator(".afd-h-rail").first();
    if ((await rail.count()) === 0) test.skip();

    const box = await rail.boundingBox();
    if (!box) {
      test.skip();
      return;
    }

    const y0 = await page.evaluate(() => window.scrollY);
    await page.mouse.move(box.x + box.width / 2, box.y + 20);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + 180, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(200);
    // Au minimum, le document ne doit pas être verrouillé
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow === "" || overflow === "auto" || overflow === "visible").toBeTruthy();
    const y1 = await page.evaluate(() => window.scrollY);
    expect(y1).toBeGreaterThanOrEqual(y0);
  });
});
