import { expect, test } from "@playwright/test";

test.describe("Offre Mambasa (expirée)", () => {
  test("n’apparaît plus sur l’accueil ni en fiche publique", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Rejoignez l’équipe AFD/i }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", {
        name: /Chef de projet basé à MAMBASA/i,
      }),
    ).toHaveCount(0);

    const response = await page.goto(
      "/ressources/opportunites/chef-de-projet-base-a-mambasa",
    );
    expect(response?.status()).toBeGreaterThanOrEqual(400);
  });

  test("document PDF historique toujours accessible", async ({ request }) => {
    const response = await request.get(
      "/documents/offres/chef-de-projet-mambasa/chef-projet-mambasa-afd.pdf",
    );
    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"] ?? "").toContain("pdf");
  });
});
