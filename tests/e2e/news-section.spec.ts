import { expect, test } from "@playwright/test";

async function dismissNewsletterIfPresent(page: import("@playwright/test").Page) {
  const dialog = page.getByRole("dialog");
  if (await dialog.isVisible().catch(() => false)) {
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden({ timeout: 5000 }).catch(() => undefined);
  }
}

test.describe("Section actualités", () => {
  test("affiche les actualités migrées ou publiées sur l’accueil", async ({
    page,
  }) => {
    await page.goto("/");
    await dismissNewsletterIfPresent(page);
    await expect(
      page.getByRole("heading", { name: /dernières actualités/i }),
    ).toBeVisible({ timeout: 15000 });

    const titles = [
      /actions contre les VBG/i,
      /formation entrepreneuriale/i,
      /mortalité maternelle/i,
    ];

    const visibleCount = await Promise.all(
      titles.map(async (title) => page.getByRole("heading", { name: title }).count()),
    ).then((counts) => counts.reduce((sum, n) => sum + n, 0));

    expect(visibleCount).toBeGreaterThan(0);

    const summaryButton = page.getByRole("button", { name: "Lire le résumé" }).first();
    if (await summaryButton.count()) {
      await summaryButton.scrollIntoViewIfNeeded();
      await dismissNewsletterIfPresent(page);
      await summaryButton.click({ force: true });
      await expect(
        page.getByRole("link", { name: /Ouvrir l.article complet/i }).first(),
      ).toBeVisible();
      await page.getByRole("button", { name: "Réduire" }).first().click({ force: true });
    }
  });

  test("page /actualites liste sans dates inventées obligatoires", async ({
    page,
  }) => {
    await page.goto("/actualites");
    await dismissNewsletterIfPresent(page);
    await expect(page.getByRole("heading", { name: "Actualités" })).toBeVisible();
  });
});
