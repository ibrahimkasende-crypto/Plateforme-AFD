import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Bouton Retour admin", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("présent sur pages internes, absent du dashboard", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    await expect(page.getByRole("button", { name: "Retour" })).toHaveCount(0);

    await page.goto("/admin/messages");
    await expect(page.getByRole("button", { name: "Retour" })).toBeVisible();
  });
});
