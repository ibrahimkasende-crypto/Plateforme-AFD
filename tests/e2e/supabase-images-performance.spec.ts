import { expect, test } from "@playwright/test";

test("accueil : images hero pointent vers le projet mandaté", async ({ page }) => {
  await page.goto("/");
  const html = await page.content();
  expect(html).toContain("mxxuxnoqnwjygawvvhcb");
  expect(html).not.toContain("qsyvkaxlwxbhuphvctpl");
});
