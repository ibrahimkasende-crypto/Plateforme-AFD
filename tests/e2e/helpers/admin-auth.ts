import type { Page } from "@playwright/test";
import { test } from "@playwright/test";

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
  await page.waitForURL(/\/admin/, { timeout: 20_000 });
}

export function skipWithoutAdminCredentials(): void {
  test.skip(
    !hasAdminCredentials(),
    "Credentials e2e admin non configurés (AFD_E2E_ADMIN_EMAIL / AFD_E2E_ADMIN_PASSWORD)",
  );
}
