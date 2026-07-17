import type { PaymentTransactionStatus } from "@/config/payment-statuses";

/**
 * Normalisation des statuts fournisseur.
 *
 * TODO SerdiPay: mapper les statuts officiels documentés uniquement.
 * Aucun statut inventé ne doit produire `confirmed`.
 */
export function mapSerdiPayStatus(
  providerStatus: string,
): PaymentTransactionStatus {
  const normalized = providerStatus.trim().toLowerCase();

  switch (normalized) {
    case "pending":
    case "created":
      return "pending";
    case "processing":
      return "processing";
    case "failed":
      return "failed";
    case "cancelled":
    case "canceled":
      return "cancelled";
    case "expired":
      return "expired";
    case "refunded":
      return "refunded";
    default:
      // Ne jamais confirmer sans mapping officiel + vérification serveur.
      return "pending";
  }
}
