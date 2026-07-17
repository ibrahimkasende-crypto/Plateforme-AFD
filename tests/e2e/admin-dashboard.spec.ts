import { expect, test } from "@playwright/test";

test.describe("Dashboard administrateur", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1440",
      "Exécuté uniquement sur desktop-1440",
    );
  });

  test("affiche le shell admin et les sections clés", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByRole("navigation", { name: /navigation admin/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /tableau de bord/i }).first()).toBeVisible();
    await expect(page.getByText(/personnes touchées/i).first()).toBeVisible();
    await expect(page.getByText(/accès rapides|actions rapides/i).first()).toBeVisible();

    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/Module en préparation/i);
  });

  test("sidebar contient les entrées principales", async ({ page }) => {
    await page.goto("/admin");
    const nav = page.getByRole("navigation", { name: /navigation admin/i });
    await expect(nav.getByRole("link", { name: /programmes/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /projets/i })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /voir le site public/i }).first(),
    ).toBeVisible();
  });

  test("filtres et export sont présents", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("combobox").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /exporter|exporterer/i }).first(),
    ).toBeVisible();
  });
});
