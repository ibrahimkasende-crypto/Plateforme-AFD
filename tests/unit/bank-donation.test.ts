import { describe, expect, it } from "vitest";
import {
  accountForCurrency,
  formatDonationAmount,
  QUICK_AMOUNTS,
  BANK_DONATION_STATUSES,
} from "@/features/dons/config/bank-donation";

describe("bank donation helpers", () => {
  it("returns USD or CDF account without conversion", () => {
    const coords = {
      account_usd: "00011050233200275289929",
      account_cdf: "00011050233200275377520",
    };
    expect(accountForCurrency(coords, "USD")).toBe("00011050233200275289929");
    expect(accountForCurrency(coords, "CDF")).toBe("00011050233200275377520");
  });

  it("exposes quick amounts per currency", () => {
    expect(QUICK_AMOUNTS.USD).toContain(50);
    expect(QUICK_AMOUNTS.CDF).toContain(100_000);
  });

  it("formats amounts", () => {
    expect(formatDonationAmount(100000, "CDF")).toMatch(/100/);
    expect(formatDonationAmount(50, "USD")).toBeTruthy();
  });

  it("keeps bank statuses distinct from auto-paid", () => {
    expect(BANK_DONATION_STATUSES).toContain("pending");
    expect(BANK_DONATION_STATUSES).toContain("proof_submitted");
    expect(BANK_DONATION_STATUSES).toContain("verified");
    expect(BANK_DONATION_STATUSES).not.toContain("paid");
  });
});
