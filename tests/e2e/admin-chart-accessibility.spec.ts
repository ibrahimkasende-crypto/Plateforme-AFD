import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Accessibilité graphiques", () => {
  test.beforeEach(() => {
    skipWithoutAdminCredentials();
  });

  test("vue tableau alternative présente", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/analyse/projets");
    await expect(page.getByRole("heading", { name: /Tableau détaillé/i })).toBeVisible();
    await expect(
      page.getByText(/Vue tabulaire alternative/i),
    ).toBeAttached();
  });
});
