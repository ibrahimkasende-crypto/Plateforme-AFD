import { expect, test } from "@playwright/test";

test.describe("Login admin — visuel", () => {
  test("desktop : fond animé et formulaire", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/connexion");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("canvas[aria-hidden='true']")).toBeVisible();
    await expect(page.getByLabel(/e-?mail|courriel/i).first()).toBeVisible();
    await expect(page.getByLabel(/mot de passe/i).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /site public/i })).toBeVisible();
  });

  test("mobile : carte utilisable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/connexion");
    const email = page.getByLabel(/e-?mail|courriel/i).first();
    await expect(email).toBeVisible();
    const box = await email.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(40);
  });

  test("fond non interactif", async ({ page }) => {
    await page.goto("/connexion");
    const canvas = page.locator("canvas[aria-hidden='true']");
    await expect(canvas).toHaveCSS("pointer-events", "none");
  });
});
