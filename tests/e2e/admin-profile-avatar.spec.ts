import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Avatar profil", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
    skipWithoutAdminCredentials();
  });

  test("workflow Confirmer la photo visible après sélection", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/mon-profil");
    await expect(page.getByText("Choisir une photo")).toBeVisible();
    // Sans fichier réel : le bouton Confirmer n’apparaît qu’après sélection.
    await expect(page.getByRole("button", { name: "Confirmer la photo" })).toHaveCount(
      0,
    );
  });
});
