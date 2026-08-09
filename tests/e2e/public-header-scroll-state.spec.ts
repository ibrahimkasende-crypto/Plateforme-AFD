import { expect, test } from "@playwright/test";

test.describe("Header public — état scroll", () => {
  test("structure stable avant/après scroll", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const header = page.getByTestId("site-header");
    await expect(header).toHaveAttribute("data-scrolled", "false");

    const before = await header.boundingBox();
    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(header).toHaveAttribute("data-scrolled", "true");
    const after = await header.boundingBox();

    expect(before && after).toBeTruthy();
    if (!before || !after) return;
    // Hauteur stable (pas de saut structurel)
    expect(Math.abs(before.height - after.height)).toBeLessThanOrEqual(4);
    await expect(page.getByTestId("desktop-navigation")).toBeVisible();
    await expect(page.getByTestId("organization-brand")).toBeVisible();
  });
});
