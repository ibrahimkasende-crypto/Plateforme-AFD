import { expect, test } from "@playwright/test";

test.describe("Offre Mambasa", () => {
  test("offre visible sur l’accueil et la fiche", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Rejoignez l’équipe AFD/i }),
    ).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/MAMBASA/i).first()).toBeVisible();

    await page.goto("/ressources/opportunites/chef-de-projet-base-a-mambasa");
    await expect(
      page.getByRole("heading", {
        name: /Chef de projet basé à MAMBASA/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Postuler maintenant/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Télécharger l’offre complète/i }),
    ).toBeVisible();
  });

  test("document PDF accessible", async ({ request }) => {
    const response = await request.get(
      "/documents/offres/chef-de-projet-mambasa/chef-projet-mambasa-afd.pdf",
    );
    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"] ?? "").toContain("pdf");
  });
});
