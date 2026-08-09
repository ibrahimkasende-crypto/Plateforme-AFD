import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Page Administrateur principal", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("super admin voit le menu ou la page", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    const link = page.getByRole("link", { name: /Administrateur principal/i });
    const visible = await link.count();
    await page.goto("/admin/administrateur-principal");
    if (page.url().includes("acces-refuse")) {
      test.skip(true, "Compte e2e sans super_admin");
    }
    await expect(
      page.getByRole("heading", { name: /Administrateur principal/i }),
    ).toBeVisible();
    if (visible > 0) {
      await expect(link.first()).toBeVisible();
    }
  });
});
