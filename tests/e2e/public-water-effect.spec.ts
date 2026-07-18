import { expect, test } from "@playwright/test";

test.describe("Effet liquide public", () => {
  test("aucune classe afd-custom-cursor / ancienne traînée", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.locator("html.afd-custom-cursor")).toHaveCount(0);
    await expect(page.locator("[class*='afd-cursor']")).toHaveCount(0);
  });

  test("pas de canvas effet sur mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForTimeout(400);
    await expect(page.locator(".afd-water-ripple")).toHaveCount(0);
  });

  test("clics non bloqués vers une page publique", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    // Vérifie que le calque d’effet ne capture pas les pointeurs
    const blocks = await page.locator(".afd-water-ripple").evaluateAll((nodes) =>
      nodes.every((node) => getComputedStyle(node).pointerEvents === "none"),
    );
    expect(blocks).toBeTruthy();

    await page.goto("/contact");
    await expect(page).toHaveURL(/contact/);
    await expect(page.locator("main")).toBeVisible();
  });
});
