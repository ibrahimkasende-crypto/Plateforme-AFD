import { expect, test } from "@playwright/test";

const christianEmail = process.env.AFD_E2E_CHRISTIAN_EMAIL;
const christianPassword = process.env.AFD_E2E_CHRISTIAN_TEMP_PASSWORD;

test.describe("AFD — premier changement de mot de passe", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    test.skip(
      !christianEmail || !christianPassword,
      "AFD_E2E_CHRISTIAN_* manquants",
    );
  });

  test("redirection obligatoire après connexion temporaire", async ({ page }) => {
    await page.goto("/connexion");
    await page.getByLabel(/e-?mail/i).fill(christianEmail!);
    await page.locator('input[type="password"]').first().fill(christianPassword!);
    await page.getByRole("button", { name: /connexion|se connecter/i }).click();
    await expect(page).toHaveURL(/changer-mot-de-passe/i, { timeout: 30_000 });
    await page.goto("/admin");
    await expect(page).toHaveURL(/changer-mot-de-passe/i, { timeout: 15_000 });
  });
});
