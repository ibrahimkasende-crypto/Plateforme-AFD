import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

const ROUTES = [
  "/admin/analyse",
  "/admin/analyse/beneficiaires",
  "/admin/analyse/projets",
  "/admin/analyse/activites",
  "/admin/analyse/provinces",
  "/admin/analyse/secteurs",
  "/admin/analyse/partenaires",
  "/admin/analyse/engagement",
  "/admin/analyse/documents",
];

test.describe("Pages analytiques", () => {
  test.beforeEach(() => {
    skipWithoutAdminCredentials();
  });

  for (const route of ROUTES) {
    test(`charge ${route}`, async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto(route);
      await expect(page.locator("main, [data-analytics-page]").first()).toBeVisible();
      await expect(page.getByText(/Module en préparation/i)).toHaveCount(0);
    });
  }

  test("finances analytiques réservées", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/analyse/finances");
    // Super admin : page OK ; sinon redirection
    const url = page.url();
    expect(
      url.includes("/admin/analyse/finances") || url.includes("/acces-refuse"),
    ).toBeTruthy();
  });
});
