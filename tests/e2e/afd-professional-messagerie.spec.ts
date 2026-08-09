import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  skipWithoutAdminCredentials,
} from "./helpers/admin-auth";

test.describe("Messagerie professionnelle Phase 1", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "desktop-1440");
  });

  test("page messagerie accessible après login", async ({ page }) => {
    skipWithoutAdminCredentials();
    await loginAsAdmin(page);
    await page.goto("/admin/messagerie");
    if (page.url().includes("changer-mot-de-passe")) {
      test.skip(true, "Changement MDP obligatoire");
    }
    await expect(
      page.getByRole("heading", { name: /Messagerie professionnelle/i }),
    ).toBeVisible({ timeout: 20_000 });
  });

  test("anonyme redirigé depuis messagerie", async ({ page }) => {
    await page.goto("/admin/messagerie");
    await expect(page).toHaveURL(/connexion|acces-refuse/i, { timeout: 15_000 });
  });

  test("header contient le lien Messagerie", async ({ page }) => {
    skipWithoutAdminCredentials();
    await loginAsAdmin(page);
    await page.goto("/admin");
    if (page.url().includes("changer-mot-de-passe")) {
      test.skip(true, "Changement MDP obligatoire");
    }
    await expect(
      page.getByRole("link", { name: /Messagerie/i }).first(),
    ).toBeVisible({ timeout: 20_000 });
  });

  test("API mail folders refuse sans session", async ({ request }) => {
    const res = await request.get("/api/mail/folders");
    expect([401, 404, 501]).toContain(res.status());
  });
});
