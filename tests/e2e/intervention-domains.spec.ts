import { expect, test } from "@playwright/test";

test.describe("Domaines d’intervention", () => {
  test("affiche les six domaines avec image et lien vers la page dédiée", async ({
    page,
  }) => {
    await page.goto("/actions/domaines-intervention");
    await page.keyboard.press("Escape");

    await expect(
      page.getByRole("heading", { name: /domaines d.intervention/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(page.getByText(/Autonomisation économique/i).first()).toBeVisible();
    await expect(page.getByText(/Protection, VBG/i).first()).toBeVisible();
    await expect(page.getByText(/Santé maternelle/i).first()).toBeVisible();
    await expect(page.getByText(/WASH/i).first()).toBeVisible();
    await expect(
      page.getByText(/Femmes, leadership et gouvernance/i).first(),
    ).toBeVisible();
    await expect(
      page.getByText(/Femmes dans la réponse humanitaire/i).first(),
    ).toBeVisible();

    const links = page.getByRole("link", { name: "Lire la suite" });
    await expect(links).toHaveCount(6);

    await links.first().click();
    await expect(page).toHaveURL(/\/actions\/domaines-intervention\/autonomisation-economique/);
    await expect(
      page.getByRole("heading", { name: /Autonomisation économique/i }),
    ).toBeVisible();
    await expect(page.getByText("Enjeu").first()).toBeVisible();
    await expect(page.getByText("Notre réponse").first()).toBeVisible();
  });

  test("page domaines responsive sans débordement", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/actions/domaines-intervention");
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("heading", { name: /domaines d.intervention/i }),
    ).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow).toBeFalsy();
  });
});
