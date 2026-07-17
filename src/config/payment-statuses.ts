/** Statuts d’une intention de don (côté métier). */
export const donationIntentStatuses = [
  "draft",
  "submitted",
  "payment_pending",
  "completed",
  "abandoned",
  "cancelled",
] as const;

export type DonationIntentStatus = (typeof donationIntentStatuses)[number];

/** Statuts d’une transaction de paiement (côté serveur uniquement pour confirmed/refunded). */
export const paymentTransactionStatuses = [
  "created",
  "pending",
  "processing",
  "confirmed",
  "failed",
  "cancelled",
  "expired",
  "refunded",
] as const;

export type PaymentTransactionStatus =
  (typeof paymentTransactionStatuses)[number];

/** Champs que le frontend ne doit jamais envoyer pour forcer un état sensible. */
export const clientForbiddenPaymentFields = [
  "confirmed",
  "refunded",
  "transaction_reference",
  "provider_response",
  "webhook_verified",
] as const;

export const donationIntentStatusLabels: Record<DonationIntentStatus, string> =
  {
    draft: "Brouillon",
    submitted: "Soumise",
    payment_pending: "Paiement en attente",
    completed: "Terminée",
    abandoned: "Abandonnée",
    cancelled: "Annulée",
  };

export const paymentTransactionStatusLabels: Record<
  PaymentTransactionStatus,
  string
> = {
  created: "Créée",
  pending: "En attente",
  processing: "En traitement",
  confirmed: "Confirmée",
  failed: "Échouée",
  cancelled: "Annulée",
  expired: "Expirée",
  refunded: "Remboursée",
};
