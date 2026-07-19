import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Dashboard drill-down D1", () => {
  test.beforeEach(() => {
    skipWithoutAdminCredentials();
  });

  test("KPI et graphiques ouvrent des analyses", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");

    await page.getByRole("link", { name: /Personnes touchées/i }).click();
    await expect(page).toHaveURL(/\/admin\/analyse\/beneficiaires/);
    await expect(page.getByRole("link", { name: /Retour au tableau de bord/i })).toBeVisible();

    await page.goto("/admin");
    await page.getByRole("link", { name: /Projets actifs/i }).click();
    await expect(page).toHaveURL(/\/admin\/analyse\/projets/);
  });
});
