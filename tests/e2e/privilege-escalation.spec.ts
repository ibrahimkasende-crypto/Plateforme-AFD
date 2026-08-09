import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Anti élévation de privilèges", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("page nouveau utilisateur n’expose pas platform_owner aux non-owners", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/utilisateurs/nouveau");
    await expect(page).not.toHaveURL(/\/connexion/);
    const options = page.locator("select option");
    // Sur l’étape rôle : avancer jusqu’à l’étape 4
    await page.getByLabel(/Prénom/i).fill("Esc");
    await page.getByLabel(/^Nom \*/i).fill("Test");
    await page.getByRole("button", { name: /Suivant/i }).click();
    await page.getByLabel(/E-mail professionnel/i).fill("esc-test@example.com");
    await page.getByRole("button", { name: /Suivant/i }).click();
    await page.getByRole("button", { name: /Suivant/i }).click();
    const texts = await options.allTextContents();
    expect(texts.join(" ")).not.toMatch(/platform_owner/i);
  });
});
