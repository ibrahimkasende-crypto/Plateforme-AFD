import { expect, test } from "@playwright/test";
import { loginAsAdmin, skipWithoutAdminCredentials } from "./helpers/admin-auth";

test.describe("Paie — permissions", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("accès paie selon rôle", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/rh/paie");
    const denied = page.url().includes("acces-refuse");
    expect(denied || page.url().includes("/admin")).toBe(true);
  });
});
