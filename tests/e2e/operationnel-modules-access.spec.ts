import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

/**
 * Suite opérationnel — modules Opérations / Finances.
 * Accès autorisé (admin) + refus (anonyme).
 */
test.describe("Opérationnel — accès refusé anonyme", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440 only");
  });

  for (const route of [
    "/admin/stocks",
    "/admin/finances/depenses",
    "/admin/finances/transactions",
    "/admin/activites",
    "/admin/urgences",
    "/admin/logistique/demandes",
  ]) {
    test(`anonyme redirigé depuis ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/connexion|acces-refuse|login/i, {
        timeout: 15_000,
      });
      await expect(page.getByText(/Module en préparation/i)).toHaveCount(0);
    });
  }
});

test.describe("Opérationnel — accès autorisé admin", () => {
  // Évite les courses sur signIn (pending « Connexion… ») en parallèle.
  test.describe.configure({ mode: "serial" });
  test.setTimeout(90_000);

  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440 only");
    skipWithoutAdminCredentials();
  });

  test("stocks : liste + navigation entrepôts/mouvements", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/stocks", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("main").last().getByRole("heading", { name: /^stocks$/i }),
    ).toBeVisible();
    await expect(page.getByText(/Module en préparation|Coming soon/i)).toHaveCount(0);
    await page.goto("/admin/stocks/entrepots", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("main").last().getByRole("heading", { name: /entrepôts/i }),
    ).toBeVisible();
    await page.goto("/admin/stocks/mouvements", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("main").last().getByRole("heading", { name: /mouvements/i }),
    ).toBeVisible();
  });

  test("finances : budgets, dépenses, transactions", async ({ page }) => {
    await loginAsAdmin(page);
    for (const route of [
      "/admin/finances",
      "/admin/finances/budgets",
      "/admin/finances/depenses",
      "/admin/finances/transactions",
    ]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.getByText(/Module en préparation|Coming soon/i)).toHaveCount(0);
      await expect(page.getByRole("main").first()).toBeVisible();
    }
  });

  test("activités : liste accessible et formulaire nouvelle", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/activites", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("main").last().getByRole("heading", { name: /^activités$/i }),
    ).toBeVisible();
    await page.goto("/admin/activites/nouvelle", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("main").last().getByRole("heading", { name: /nouvelle activité/i }),
    ).toBeVisible();
    await expect(page.locator('input[name="title"]').first()).toBeVisible();
  });

  test("urgences : liste + création", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/urgences", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("main").last().getByRole("heading", { name: /^urgences$/i }),
    ).toBeVisible();
    await page.goto("/admin/urgences/nouvelle", { waitUntil: "domcontentloaded" });
    await expect(page.locator("form")).toBeVisible();
  });

  test("logistique demandes : liste + workflow visible", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/logistique/demandes", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("main").last().getByRole("heading", { name: /demandes/i }),
    ).toBeVisible();
    await expect(page.getByText(/Module en préparation/i)).toHaveCount(0);
  });
});
