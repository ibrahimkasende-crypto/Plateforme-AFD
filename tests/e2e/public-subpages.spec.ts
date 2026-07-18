import { expect, test } from "@playwright/test";

test.describe("Sous-pages impact et ressources", () => {
  test("histoires d’impact affiche un état vide professionnel ou une liste", async ({
    page,
  }) => {
    await page.goto("/impact/histoires");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const text = await page.locator("main").innerText();
    expect(
      text.includes("Aucun contenu") ||
        text.includes("Aucune histoire") ||
        text.includes("Lire l’histoire") ||
        text.includes("Lire l'histoire"),
    ).toBeTruthy();
  });

  test("témoignages affiche un état vide professionnel ou une liste", async ({
    page,
  }) => {
    await page.goto("/impact/temoignages");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const text = await page.locator("main").innerText();
    expect(
      text.includes("Aucun contenu") ||
        text.includes("Aucun témoignage") ||
        text.includes("«"),
    ).toBeTruthy();
  });

  test("appels d’offres affiche filtres et état vide ou liste", async ({
    page,
  }) => {
    await page.goto("/ressources/appels-offres");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByPlaceholder(/rechercher/i)).toBeVisible();
  });
});
