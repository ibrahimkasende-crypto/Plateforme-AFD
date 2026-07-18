import { expect, test } from "@playwright/test";

test.describe("Domaines d’intervention", () => {
  test("affiche les six domaines et permet d’ouvrir/fermer", async ({ page }) => {
    await page.goto("/actions/domaines-intervention");
    await page.keyboard.press("Escape");

    await expect(
      page.getByRole("heading", { name: /domaines d.intervention/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(page.getByText(/Autonomisation économique/i).first()).toBeVisible();
    await expect(page.getByText(/Protection, VBG/i).first()).toBeVisible();
    await expect(page.getByText(/Santé maternelle/i).first()).toBeVisible();
    await expect(page.getByText(/WASH/i).first()).toBeVisible();
    await expect(page.getByText(/Éducation des femmes/i).first()).toBeVisible();
    await expect(page.getByText(/populations déplacées/i).first()).toBeVisible();

    const toggles = page.getByRole("button", { name: /Lire la suite|Réduire/ });
    await expect(toggles).toHaveCount(6);

    const firstCard = page.locator("article").first();
    const toggle = firstCard.getByRole("button", { name: /Lire la suite|Réduire/ });
    await toggle.evaluate((el: HTMLElement) => el.click());

    await expect(firstCard.getByText("Enjeu")).toBeVisible({ timeout: 10000 });
    await expect(firstCard.getByText("Notre réponse")).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    await toggle.evaluate((el: HTMLElement) => el.click());
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
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
