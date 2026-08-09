import { expect, test } from "@playwright/test";

test.describe("Hero typewriter", () => {
  test("trois lignes + texte accessible", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator("h1.hero-slogan, h1.afd-h1-hero").first();
    await expect(h1).toBeVisible();

    const sr = h1.locator(".sr-only");
    await expect(sr).toContainText("Des femmes engagées");
    await expect(sr).toContainText("pour des communautés");
    await expect(sr).toContainText("plus fortes");

    await page.waitForTimeout(2500);
    const visual = h1.locator('[aria-hidden="true"]');
    await expect(visual).toContainText("Des femmes engagées");
    await expect(visual).toContainText("plus fortes");
  });

  test("reduced motion : texte immédiat", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const h1 = page.locator("h1.hero-slogan, h1.afd-h1-hero").first();
    await expect(h1.locator('[aria-hidden="true"]')).toContainText(
      "Des femmes engagées",
    );
    await expect(h1.locator('[aria-hidden="true"]')).toContainText("plus fortes");
  });
});
