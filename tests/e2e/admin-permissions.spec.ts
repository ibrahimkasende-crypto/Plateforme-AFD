import { expect, test } from "@playwright/test";

test.describe("Permissions dashboard admin", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1440",
      "Exécuté uniquement sur desktop-1440",
    );
  });

  test("la page admin est accessible (phase sans auth stricte)", async ({
    page,
  }) => {
    const response = await page.goto("/admin");
    expect(response?.status()).toBeLessThan(400);
    await expect(page.getByRole("heading", { name: /tableau de bord/i }).first()).toBeVisible();
  });

  test("le rôle affiché est présent dans le header", async ({ page }) => {
    await page.goto("/admin");
    await expect(
      page.getByText(/direction générale|administrateur|lecture partenaire|finance|communication/i).first(),
    ).toBeVisible();
  });
});
