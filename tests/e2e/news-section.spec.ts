import { expect, test } from "@playwright/test";

async function dismissNewsletterIfPresent(page: import("@playwright/test").Page) {
  const dialog = page.getByRole("dialog");
  if (await dialog.isVisible().catch(() => false)) {
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden({ timeout: 5000 }).catch(() => undefined);
  }
}

test.describe("Section actualités", () => {
  test("affiche les trois actualités publiées sur l’accueil", async ({ page }) => {
    await page.goto("/");
    await dismissNewsletterIfPresent(page);

    await expect(
      page.getByRole("heading", { name: /dernières nouvelles/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      page.getByText(/Restez informés de nos actions sur le terrain/i),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: /Lutte contre Ebola/i,
      }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Urgence en Ituri/i }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /maillage territorial/i }).first(),
    ).toBeVisible();

    await expect(page.getByRole("link", { name: "Tout voir" }).first()).toBeVisible();
  });

  test("page /actualites liste les articles", async ({ page }) => {
    await page.goto("/actualites");
    await dismissNewsletterIfPresent(page);
    await expect(page.getByRole("heading", { name: "Actualités" })).toBeVisible();
    await expect(page.getByText(/Lutte contre Ebola/i).first()).toBeVisible();
  });
});
