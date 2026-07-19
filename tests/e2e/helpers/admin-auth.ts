import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

export function hasAdminCredentials(): boolean {
  return Boolean(
    process.env.AFD_E2E_ADMIN_EMAIL && process.env.AFD_E2E_ADMIN_PASSWORD,
  );
}

export async function loginAsAdmin(page: Page): Promise<void> {
  const email = process.env.AFD_E2E_ADMIN_EMAIL!;
  const password = process.env.AFD_E2E_ADMIN_PASSWORD!;
  await page.goto("/connexion");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole("button", { name: /se connecter|connexion/i }).click();

  // L’alerte toast vide (live region) ne doit pas être confondue avec une erreur formulaire.
  const formError = page.locator('form [role="alert"]');
  const outcome = await Promise.race([
    page.waitForURL(/\/admin/, { timeout: 45_000 }).then(() => "ok" as const),
    formError
      .waitFor({ state: "visible", timeout: 45_000 })
      .then(() => "alert" as const),
  ]);

  if (outcome === "alert") {
    const message =
      (await formError.textContent())?.trim() ?? "erreur inconnue";
    throw new Error(`Connexion admin refusée : ${message}`);
  }

  await expect(page).toHaveURL(/\/admin/);
}

export function skipWithoutAdminCredentials(): void {
  test.skip(
    !hasAdminCredentials(),
    "Credentials e2e admin non configurés (AFD_E2E_ADMIN_EMAIL / AFD_E2E_ADMIN_PASSWORD)",
  );
}
