import { expect, test } from "@playwright/test";

test.describe("Dashboard admin — permissions", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1440" &&
        testInfo.project.name !== "desktop-1536",
      "Exécuté sur desktop-1440 ou desktop-1536",
    );
  });

  test("utilisateur non authentifié est redirigé depuis /admin", async ({
    page,
  }) => {
    await page.goto("/admin");
    await page.waitForURL(/\/connexion/);
    expect(page.url()).toMatch(/\/connexion/);
    expect(page.url()).toMatch(/next=/);
    await expect(
      page.getByRole("heading", { name: /administration plateforme-afd/i }),
    ).toBeVisible();
  });

  test("utilisateur non authentifié ne voit pas data-dashboard-overview", async ({
    page,
  }) => {
    await page.goto("/admin");
    await page.waitForURL(/\/connexion/);
    await expect(page.locator("[data-dashboard-overview]")).toHaveCount(0);
  });
});
