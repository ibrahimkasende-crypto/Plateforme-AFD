import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Admin — groupes de navigation", () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("groupes principaux et sous-menus", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    const sidebar = page.locator("[data-admin-sidebar]");
    await expect(sidebar).toBeVisible();

    for (const label of [
      "Opérations",
      "Suivi et impact",
      "Communication",
      "Engagement",
      "Organisation",
      "Rapports et documents",
    ]) {
      await expect(sidebar.getByText(label, { exact: false }).first()).toBeVisible();
    }

    await expect(sidebar.getByText(/^Paramètres$/)).toHaveCount(0);

    const operations = sidebar.getByRole("button", { name: /opérations/i }).first();
    if (await operations.count()) {
      await operations.click();
    }
    await expect(sidebar.getByRole("link", { name: /programmes/i }).first()).toBeVisible();
  });
});
