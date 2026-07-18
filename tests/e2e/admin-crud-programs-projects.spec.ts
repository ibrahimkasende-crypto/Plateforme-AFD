import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Admin CRUD programmes / projets", () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("listes programmes et projets accessibles", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/programmes");
    await expect(page.getByRole("heading", { name: /programmes/i })).toBeVisible();
    await expect(page.getByText(/Module en préparation/i)).toHaveCount(0);
    await page.goto("/admin/projets");
    await expect(page.getByRole("heading", { name: /projets/i })).toBeVisible();
  });
});
