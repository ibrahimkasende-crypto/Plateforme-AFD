import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Admin — états vides professionnels", () => {
  test.beforeEach(() => {
    skipWithoutAdminCredentials();
  });

  test("aucune page n’affiche Module en préparation", async ({ page }) => {
    test.skip(test.info().project.name !== "desktop-1440", "desktop-1440");
    await loginAsAdmin(page);
    for (const route of ["/admin/activites", "/admin/messages", "/admin/finances"]) {
      await page.goto(route);
      await expect(page.getByText(/Module en préparation/i)).toHaveCount(0);
      await expect(
        page.getByText(/architecture validée/i),
      ).toHaveCount(0);
    }
  });
});
