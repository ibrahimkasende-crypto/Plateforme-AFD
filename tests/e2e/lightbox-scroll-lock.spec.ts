import { expect, test } from "@playwright/test";

test.describe("Lightbox scroll lock", () => {
  test("body lock puis unlock sur photothèque si galerie présente", async ({
    page,
  }) => {
    await page.goto("/bibliotheque/phototheque");
    const thumb = page.locator("section button").filter({ has: page.locator("img") }).first();
    if ((await thumb.count()) === 0) test.skip();

    await thumb.click();
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
  });
});
