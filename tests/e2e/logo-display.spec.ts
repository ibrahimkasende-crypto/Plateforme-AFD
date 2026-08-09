import { expect, test } from "@playwright/test";

test.describe("Logo circulaire", () => {
  test("header utilise un logo circulaire", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const logo = page.locator("[data-organization-logo]").first();
    await expect(logo).toBeVisible();
    const radius = await logo.evaluate((el) => getComputedStyle(el).borderRadius);
    expect(radius === "9999px" || radius.includes("%") || parseFloat(radius) > 20).toBeTruthy();
  });
});
