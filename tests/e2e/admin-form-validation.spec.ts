import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Validation formulaires", () => {
  test.beforeEach(() => {
    skipWithoutAdminCredentials();
  });

  test("champs requis visibles sur nouveau rapport", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/rapports/nouveau");
    await expect(page.locator('input[name="title"]')).toHaveAttribute("required", "");
  });
});
