import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Formulaires modernes", () => {
  test.beforeEach(() => {
    skipWithoutAdminCredentials();
  });

  test("formulaire nouveau projet modernisé", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/projets/nouvelle");
    await expect(page.getByRole("heading", { name: /Nouveau projet/i })).toBeVisible();
    await expect(page.getByText(/Informations générales/i)).toBeVisible();
    await expect(page.getByLabel(/Titre/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Enregistrer/i })).toBeVisible();
  });
});
