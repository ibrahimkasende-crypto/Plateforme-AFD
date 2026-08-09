import { expect, test } from "@playwright/test";

test.describe("Header public — dropdowns", () => {
  test("dropdown desktop reste dans le viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const nav = page.getByTestId("desktop-navigation");
    await nav.getByRole("button", { name: /Qui sommes-nous/i }).hover();
    const menu = page.getByRole("menu").first();
    await expect(menu).toBeVisible();

    const box = await menu.boundingBox();
    expect(box).toBeTruthy();
    if (!box) return;
    expect(box.x).toBeGreaterThanOrEqual(-1);
    expect(box.x + box.width).toBeLessThanOrEqual(1440 + 1);
  });

  test("menu Plus compact ouvre les liens secondaires", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByTestId("nav-plus-menu").getByRole("button", { name: "Plus" }).click();
    const menu = page.getByRole("menu");
    await expect(menu.getByRole("menuitem", { name: "Contact" })).toBeVisible();
    await menu.getByRole("menuitem", { name: "Contact" }).click();
    await expect(page).toHaveURL(/\/contact/);
  });
});
