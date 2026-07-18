import { expect, test } from "@playwright/test";

test.describe("Animations de sections", () => {
  test.describe.configure({ timeout: 60_000 });

  test("accueil lisible sans bloquer le contenu", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("main").getByRole("heading").first()).toBeVisible();
  });

  test("reduced motion : contenu immédiatement présent", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("main").getByRole("heading").first()).toBeVisible();
  });
});
