import { expect, test } from "@playwright/test";

test.describe("prefers-reduced-motion", () => {
  test("site utilisable avec motion réduite", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("canvas.pointer-events-none.fixed")).toHaveCount(0);
  });
});
