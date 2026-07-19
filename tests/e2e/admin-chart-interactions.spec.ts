import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Interactions graphiques", () => {
  test.beforeEach(() => {
    skipWithoutAdminCredentials();
  });

  test("export analytique disponible", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/analyse/beneficiaires");
    await expect(page.getByRole("button", { name: /Exporter/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /tableau/i }),
    ).toBeVisible();
  });
});
