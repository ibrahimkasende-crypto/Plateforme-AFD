import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Formulaires mobile", () => {
  test.beforeEach(() => {
    skipWithoutAdminCredentials();
  });

  test("nouveau projet lisible en 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsAdmin(page);
    await page.goto("/admin/projets/nouvelle");
    await expect(page.getByRole("heading", { name: /Nouveau projet/i })).toBeVisible();
  });
});
