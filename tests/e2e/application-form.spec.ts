import { expect, test } from "@playwright/test";

async function gotoPublic(page: import("@playwright/test").Page, path: string) {
  await page.addInitScript(() => {
    window.sessionStorage.setItem("afd_newsletter_seen_session", "true");
    window.sessionStorage.setItem("afd_loader_seen", "true");
    document.cookie = "afd_newsletter_subscribed=true; path=/; max-age=31536000";
  });
  const response = await page.goto(path);
  await page.waitForLoadState("domcontentloaded");
  const closeNewsletter = page.getByRole("button", {
    name: /Fermer la newsletter/i,
  });
  if (await closeNewsletter.isVisible().catch(() => false)) {
    await closeNewsletter.click({ force: true });
  }
  return response;
}

test("le formulaire spontané est présent ou l’option est explicitement fermée", async ({
  page,
}) => {
  const response = await gotoPublic(page, "/rejoindre-equipe");
  expect(response?.status()).toBeLessThan(400);
  const form = page
    .locator("form")
    .filter({ has: page.locator('input[name="prenom"]') });
  if ((await form.count()) > 0) {
    await expect(form.locator('input[name="email"]')).toBeVisible();
    await expect(
      form.locator('textarea[name="lettreMotivation"]'),
    ).toBeVisible();
    await expect(form.locator('input[name="consentement"]')).toBeVisible();
  } else {
    await expect(
      page.getByText(/candidatures spontanées ne sont pas ouvertes/i),
    ).toBeVisible();
  }
});
