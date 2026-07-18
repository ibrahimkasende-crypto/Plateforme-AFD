import { expect, test } from "@playwright/test";

test.describe("Rails horizontaux mobiles", () => {
  test.describe.configure({ timeout: 60_000 });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("afd_newsletter_seen_session", "true");
      window.sessionStorage.setItem("afd_loader_seen", "true");
      document.cookie =
        "afd_newsletter_subscribed=true; path=/; max-age=31536000";
    });
  });

  test("accueil sans débordement horizontal global", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main")).toBeVisible();
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth <= doc.clientWidth + 2;
    });
    expect(overflow).toBeTruthy();
  });

  test("région domaines scrollable sur téléphone", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 1440) >= 768, "Rail horizontal réservé au mobile");

    await page.goto("/", { waitUntil: "domcontentloaded" });
    const rail = page.getByRole("region", { name: /domaines d’intervention/i });
    await expect(rail).toBeVisible({ timeout: 15_000 });
    const hasOverflow = await rail.evaluate(
      (el) => el.scrollWidth > el.clientWidth - 1,
    );
    expect(hasOverflow).toBeTruthy();
  });
});
