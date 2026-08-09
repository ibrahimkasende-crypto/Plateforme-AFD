import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Sidebar admin — identité AFD", () => {
  test.beforeEach(({}, testInfo) => {
    skipWithoutAdminCredentials();
    test.skip(
      !["desktop-1440", "desktop-1536"].includes(testInfo.project.name),
      "Desktop",
    );
  });

  test("plateforme et organisation AFD", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    const sidebar = page.locator("[data-admin-sidebar]");
    await expect(sidebar.locator("[data-product-brand]")).toContainText(
      "AFD",
    );
    await expect(sidebar.locator("[data-organization-identity]")).toBeVisible();
    await expect(sidebar.locator("[data-publisher-brand]")).toContainText(
      /Plateforme officielle AFD/i,
    );
  });

  test("mode réduit : logo produit + indicateur org", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    const sidebar = page.locator("[data-admin-sidebar]");

    await page
      .getByRole("button", { name: /réduire la barre latérale/i })
      .first()
      .click();
    await expect(sidebar).toHaveAttribute("data-collapsed", "true");
    await expect(sidebar.locator("[data-product-brand]")).toBeVisible();
    await expect(
      sidebar.getByText(/Organisation active/i),
    ).toBeHidden();
  });
});
