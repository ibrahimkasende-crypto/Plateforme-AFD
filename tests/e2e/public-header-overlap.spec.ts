import { expect, test } from "@playwright/test";

const WIDTHS = [1100, 1180, 1280, 1366, 1440] as const;

function boxesOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
  pad = 2,
) {
  return !(
    a.x + a.width <= b.x + pad ||
    b.x + b.width <= a.x + pad ||
    a.y + a.height <= b.y + pad ||
    b.y + b.height <= a.y + pad
  );
}

test.describe("Header public — absence de chevauchement", () => {
  for (const width of WIDTHS) {
    test(`zones gauche / centre / droite sans overlap à ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/", { waitUntil: "domcontentloaded" });

      const left = page.locator('[data-header-zone="left"]');
      const right = page.locator('[data-header-zone="right"]');
      await expect(left).toBeVisible();
      await expect(right).toBeVisible();

      const leftBox = await left.boundingBox();
      const rightBox = await right.boundingBox();
      expect(leftBox).toBeTruthy();
      expect(rightBox).toBeTruthy();
      if (!leftBox || !rightBox) return;

      expect(boxesOverlap(leftBox, rightBox)).toBe(false);

      if (width >= 1280) {
        const center = page.locator('[data-header-zone="center"]');
        await expect(center).toBeVisible();
        const centerBox = await center.boundingBox();
        expect(centerBox).toBeTruthy();
        if (!centerBox) return;
        expect(boxesOverlap(leftBox, centerBox)).toBe(false);
        expect(boxesOverlap(centerBox, rightBox)).toBe(false);

        const accueil = page
          .getByTestId("desktop-navigation")
          .getByRole("link", { name: "Accueil", exact: true });
        await expect(accueil).toBeVisible();
        const accueilBox = await accueil.boundingBox();
        const brandBox = await page.getByTestId("organization-brand").boundingBox();
        expect(accueilBox && brandBox).toBeTruthy();
        if (accueilBox && brandBox) {
          expect(boxesOverlap(accueilBox, brandBox)).toBe(false);
          expect(accueilBox.x).toBeGreaterThan(brandBox.x + brandBox.width - 2);
        }
      }
    });
  }
});
