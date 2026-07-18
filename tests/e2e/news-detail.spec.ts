import { expect, test } from "@playwright/test";

const migratedSlugs = [
  "afd-actions-vbg-est-rdc",
  "formation-entrepreneuriale-kinshasa",
  "sensibilisation-sante-maternelle",
];

test.describe("Détail actualité", () => {
  for (const slug of migratedSlugs) {
    test(`ouvre l’article ${slug}`, async ({ page }) => {
      await page.goto(`/actualites/${slug}`);
      await expect(page.locator("#article-content")).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(/min de lecture/i)).toBeVisible();
      await expect(page.getByText(/Retour aux actualités/i)).toBeVisible();
    });
  }
});
