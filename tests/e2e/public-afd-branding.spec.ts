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
    await expect(page.locator("body")).not.toContainText(
      "Bienvenue dans LISUNGI",
    );

    const ico = await request.get("/favicon.ico");
    expect(ico.ok()).toBeTruthy();
    const png = await request.get("/icon.png");
    expect(png.ok()).toBeTruthy();
  });

  test("logo LISUNGI absent du header public", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header").first();
    await expect(header).not.toContainText("LISUNGI");
    await expect(header).not.toContainText("Lisungi Hub");
  });
});
