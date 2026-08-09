import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Admin bibliothèque import", () => {
  skipWithoutAdminCredentials();

  test("page import avec aperçu", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/bibliotheque/import", {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.getByRole("heading", { name: /Import/i }),
    ).toBeVisible();
    await expect(page.locator("textarea")).toBeVisible();
  });
});
