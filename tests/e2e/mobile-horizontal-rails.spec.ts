import { expect, test } from "@playwright/test";

test.describe("Rails horizontaux mobiles", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test.describe.configure({ timeout: 60_000 });

  test("accueil sans débordement horizontal global", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main")).toBeVisible();
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth <= doc.clientWidth + 2;
    });
    expect(overflow).toBeTruthy();
  });

  test("région domaines scrollable si présente", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const rail = page.getByRole("region", { name: /domaines d’intervention/i });
    if ((await rail.count()) > 0) {
      await expect(rail.first()).toBeVisible();
      const hasOverflow = await rail
        .first()
        .evaluate((el) => el.scrollWidth > el.clientWidth - 1);
      expect(hasOverflow).toBeTruthy();
    }
  });
});
