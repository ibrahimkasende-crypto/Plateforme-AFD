import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Admin bibliothèque CRUD", () => {
  skipWithoutAdminCredentials();

  test("module admin accessible", async ({ page }) => {
    await loginAsAdmin(page);
    const response = await page.goto("/admin/bibliotheque", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBeLessThan(400);
    await expect(
      page.getByRole("heading", { name: /Bibliothèque/i }),
    ).toBeVisible();
  });
});
