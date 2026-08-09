import { afterEach, describe, expect, it } from "vitest";

describe("sanitizeSmtpErrorMessage", () => {
  const original = process.env.MAIL_SMTP_PASSWORD;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.MAIL_SMTP_PASSWORD;
    } else {
      process.env.MAIL_SMTP_PASSWORD = original;
    }
  });

  it("redacte le mot de passe SMTP", async () => {
    process.env.MAIL_SMTP_PASSWORD = "SuperSecretPass123!";
    const { sanitizeSmtpErrorMessage } = await import(
      "@/lib/contact/sanitize-smtp-error"
    );
    const cleaned = sanitizeSmtpErrorMessage(
      new Error("Auth failed with SuperSecretPass123! for user"),
    );
    expect(cleaned).not.toContain("SuperSecretPass123!");
    expect(cleaned).toContain("[redacted]");
  });
});
