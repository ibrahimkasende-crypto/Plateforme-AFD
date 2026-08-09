import { expect, test } from "@playwright/test";

test.describe("Site public — identité AFD conservée", () => {
  test("marque AFD sur l’accueil et favicon inchangé", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: /Alliance des Femmes|AFD|Accueil/i }).first(),
    ).toBeVisible();
    await expect(page.locator("body")).not.toContainText("Tableau de bord AFD");

    const ico = await request.get("/favicon.ico");
    expect(ico.ok()).toBeTruthy();
    const png = await request.get("/icon.png");
    expect(png.ok()).toBeTruthy();
  });

  test("header public centré sur AFD", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header").first();
    await expect(header).toContainText(/Alliance des Femmes/i);
  });
});
