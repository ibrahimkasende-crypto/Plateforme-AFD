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

test("les opportunités et rejoindre l’équipe restent accessibles", async ({
  page,
}) => {
  for (const path of ["/ressources/opportunites", "/rejoindre-equipe"]) {
    const response = await gotoPublic(page, path);
    expect(response?.status()).toBeLessThan(400);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});
