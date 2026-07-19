import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Indicateur Next.js / site public", () => {
  test.beforeEach(() => {
    skipWithoutAdminCredentials();
  });

  test("bouton Voir le site public visible", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    const publicBtn = page.locator("[data-admin-public-site]");
    await expect(publicBtn).toBeVisible();
    const box = await publicBtn.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.x).toBeLessThan(120);
  });
});
