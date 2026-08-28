import type { PaymentTransactionStatus } from "@/config/payment-statuses";

/**
 * Normalisation des statuts prestataire → statuts internes AFD.
 * À compléter uniquement avec la documentation officielle du prestataire AFD
 * (ex. Equity BCDC Eazzy e-Commerce / CyberSource).
 *
 * Ne jamais mapper automatiquement vers `confirmed` côté navigateur.
 */
export function mapCardProviderStatus(
  providerStatus: string,
): PaymentTransactionStatus {
  const normalized = providerStatus.trim().toLowerCase();
  switch (normalized) {
    case "created":
    case "initiated":
      return "created";
    case "pending":
    case "awaiting":
      return "pending";
    case "processing":
      return "processing";
    case "failed":
    case "declined":
      return "failed";
    case "cancelled":
    case "canceled":
      return "cancelled";
    case "expired":
      return "expired";
    case "refunded":
      return "refunded";
    // confirmed / paid : uniquement après vérification serveur + webhook signé
    default:
      return "pending";
  }
}
