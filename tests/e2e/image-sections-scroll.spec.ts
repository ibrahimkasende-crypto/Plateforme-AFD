import { expect, test } from "@playwright/test";

test("sections images de l’accueil restent scrollables", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 0));
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 500);
  }
  const y = await page.evaluate(() => window.scrollY);
  expect(y).toBeGreaterThan(400);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});
