import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Dashboard admin — actions rapides et export", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1440" &&
        testInfo.project.name !== "desktop-1536",
      "Exécuté sur desktop-1440 ou desktop-1536",
    );
    skipWithoutAdminCredentials();
  });

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin");
    await page.waitForLoadState("domcontentloaded");
  });

  test("liens actions rapides ont les hrefs attendus", async ({ page }) => {
    const quickActions = [
      { name: /ajouter un projet/i, href: "/admin/projets/nouveau" },
      { name: /ajouter une activité/i, href: "/admin/activites/nouvelle" },
      { name: /ajouter un bénéficiaire/i, href: "/admin/beneficiaires/nouveau" },
      { name: /générer un rapport/i, href: "/admin/rapports/nouveau" },
      {
        name: /envoyer une newsletter/i,
        href: "/admin/newsletter/campagnes/nouvelle",
      },
    ];

    await expect(page.getByText(/accès rapides/i).first()).toBeVisible();

    for (const action of quickActions) {
      const link = page.getByRole("link", { name: action.name }).first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", action.href);
    }
  });

  test("menu export s'ouvre et contient les options", async ({ page }) => {
    const exportButton = page
      .getByRole("button", { name: /exporter/i })
      .first();
    await expect(exportButton).toBeVisible();
    await exportButton.click();

    await expect(page.getByRole("menu")).toBeVisible();
    await expect(page.getByRole("menuitem", { name: /impression/i })).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: /télécharger csv/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: /rapport personnalisé/i }),
    ).toBeVisible();

    const rapportLink = page.getByRole("menuitem", {
      name: /rapport personnalisé/i,
    });
    await expect(rapportLink).toHaveAttribute("href", "/admin/rapports/nouveau");
  });
});
