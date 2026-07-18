import { expect, test } from "@playwright/test";

const publishedSlugs = [
  "lutte-contre-ebola-sensibilisation-prevention",
  "urgence-ituri-deplaces-ceca-20-makoko-mambasa",
  "expansion-afd-maillage-territorial-7-provinces",
];

test.describe("Détail actualité", () => {
  for (const slug of publishedSlugs) {
    test(`ouvre l’article ${slug}`, async ({ page }) => {
      await page.goto(`/actualites/${slug}`);
      await expect(page.locator("#article-content")).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(/min de lecture/i)).toBeVisible();
      await expect(page.getByText(/Retour aux actualités/i)).toBeVisible();
    });
  }
});
