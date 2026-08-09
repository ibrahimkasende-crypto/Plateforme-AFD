import { expect, test } from "@playwright/test";

test.describe("Bibliothèque détail", () => {
  test("ouvre une activité depuis la liste", async ({ page }) => {
    await page.goto("/bibliotheque", { waitUntil: "domcontentloaded" });
    const cardLink = page.locator('a[href^="/bibliotheque/"]').filter({
      has: page.locator("h3"),
    }).first();
    await expect(cardLink).toBeVisible({ timeout: 15000 });
    const href = await cardLink.getAttribute("href");
    expect(href).toMatch(/^\/bibliotheque\/.+/);
    await cardLink.click();
    await expect(page).toHaveURL(/\/bibliotheque\/.+/);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });
});
