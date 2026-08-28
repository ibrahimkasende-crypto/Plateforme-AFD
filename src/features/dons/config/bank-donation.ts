export const BANK_TRANSFER_METHOD = "bank_transfer" as const;
export const CARD_METHOD = "card" as const;

export const BANK_DONATION_STATUSES = [
  "pending",
  "proof_submitted",
  "verified",
  "rejected",
  "cancelled",
] as const;

export type BankDonationStatus = (typeof BANK_DONATION_STATUSES)[number];

export const BANK_DONATION_CURRENCIES = ["USD", "CDF"] as const;
export type BankDonationCurrency = (typeof BANK_DONATION_CURRENCIES)[number];

export const QUICK_AMOUNTS: Record<BankDonationCurrency, number[]> = {
  USD: [10, 25, 50, 100],
  CDF: [25_000, 50_000, 100_000, 250_000],
};

export const PROOF_ALLOWED_MIME = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
] as const;

export const PROOF_MAX_BYTES = 10 * 1024 * 1024;
export const DONS_PREUVES_BUCKET = "dons-preuves";

export const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  intent: "Intention",
  proof_submitted: "Preuve reçue",
  verified: "Confirmé",
  confirmed: "Confirmé",
  rejected: "Rejeté",
  cancelled: "Annulé",
  refunded: "Remboursé",
};

export function formatDonationAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("fr-CD", {
      style: "decimal",
      maximumFractionDigits: currency === "CDF" ? 0 : 2,
    }).format(amount);
  } catch {
    return String(amount);
  }
}

export function accountForCurrency(
  coords: { account_usd: string; account_cdf: string },
  currency: BankDonationCurrency,
): string {
  return currency === "USD" ? coords.account_usd : coords.account_cdf;
}
