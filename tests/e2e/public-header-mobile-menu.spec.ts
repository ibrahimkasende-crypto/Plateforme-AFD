import { expect, test } from "@playwright/test";

test.describe("Header public — menu mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("ouverture, navigation et fermeture", async ({ page }) => {
    const trigger = page.getByTestId("mobile-menu-trigger");
    await expect(trigger).toBeVisible();
    await trigger.click();

    const panel = page.getByTestId("mobile-menu-panel");
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("link", { name: "Accueil" })).toBeVisible();
    await expect(panel.getByRole("link", { name: "Contact" })).toBeVisible();
    await expect(
      panel.getByRole("link", { name: /Soutenir/i }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
  });

  test("fermeture après navigation", async ({ page }) => {
    await page.getByTestId("mobile-menu-trigger").click();
    const panel = page.getByTestId("mobile-menu-panel");
    await expect(panel).toBeVisible();
    await panel.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.getByTestId("mobile-menu-panel")).toHaveCount(0);
  });

  test("pas de CTA Soutenir dans la barre (uniquement drawer)", async ({
    page,
  }) => {
    const header = page.getByTestId("site-header");
    await expect(
      header.getByRole("link", { name: /Soutenir/i }),
    ).toHaveCount(0);
  });
});
