import { expect, test } from "@playwright/test";

/** Tests de contrat UI pour l’administration AFD. */
test.describe("Isolation organisationnelle", () => {
  test("page abonnement accessible sans bloquer le pilote", async ({
    page,
  }) => {
    test.skip(
      !process.env.AFD_E2E_ADMIN_EMAIL || !process.env.AFD_E2E_ADMIN_PASSWORD,
      "Credentials admin requis (AFD_E2E_ADMIN_EMAIL / AFD_E2E_ADMIN_PASSWORD)",
    );
    const { loginAsAdmin } = await import("./helpers/admin-auth");
    await loginAsAdmin(page);
    await page.goto("/admin/abonnement");
    await expect(page.locator("[data-subscription-panel]")).toBeVisible();
    await expect(page.getByText(/Pilote interne/i)).toBeVisible();
    await expect(page.getByText(/AFD/i).first()).toBeVisible();
  });
});
