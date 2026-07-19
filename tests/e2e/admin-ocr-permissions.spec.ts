import { test, expect } from "@playwright/test";

test.describe("Admin OCR permissions", () => {
  test("API process refuse sans secret ni session", async ({ request }) => {
    const res = await request.post("/api/ocr/process", {
      data: {},
    });
    expect([401, 403, 503]).toContain(res.status());
  });
});
