import type { AllowedCurrency } from "@/config/site";
import type { PaymentTransactionStatus } from "@/config/payment-statuses";

export type CreatePaymentInput = {
  amount: number;
  currency: AllowedCurrency;
  internalReference: string;
  idempotencyKey: string;
  description: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    country?: string;
  };
  metadata?: Record<string, string>;
  returnUrl: string;
  callbackUrl: string;
};

export type CreatePaymentResult = {
  providerReference: string;
  status: PaymentTransactionStatus;
  redirectUrl?: string;
  raw: Record<string, unknown>;
};

export type PaymentStatusResult = {
  providerReference: string;
  status: PaymentTransactionStatus;
  providerStatus: string;
  amount?: number;
  currency?: string;
  raw: Record<string, unknown>;
};

export type WebhookVerificationInput = {
  headers: Headers;
  rawBody: string;
};

export type WebhookVerificationResult = {
  valid: boolean;
  eventId?: string;
  providerReference?: string;
  status?: PaymentTransactionStatus;
  amount?: number;
  currency?: string;
  raw: Record<string, unknown>;
};

export type RefundPaymentInput = {
  providerReference: string;
  amount?: number;
  reason?: string;
  idempotencyKey: string;
};

export type RefundPaymentResult = {
  status: PaymentTransactionStatus;
  raw: Record<string, unknown>;
};

/**
 * Abstraction générique d’un prestataire de paiement carte (Visa/Mastercard).
 * Aucun prestataire AFD n’est activé tant que CARD_PAYMENT_ENABLED=false
 * et que le contrat marchand AFD n’est pas fourni.
 */
export interface PaymentProvider {
  readonly name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  getPaymentStatus(providerReference: string): Promise<PaymentStatusResult>;
  verifyWebhook(input: WebhookVerificationInput): Promise<WebhookVerificationResult>;
  refundPayment?(input: RefundPaymentInput): Promise<RefundPaymentResult>;
  normalizeStatus(providerStatus: string): PaymentTransactionStatus;
}
