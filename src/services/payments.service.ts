import { randomUUID } from "crypto";
import {
  CardPaymentNotConfiguredError,
  cardPaymentProvider,
  getCardPaymentConfig,
} from "@/lib/payments/providers/card";
import type { PaymentTransaction } from "@/features/dons/types/donation";
import type { DonationIntent } from "@/features/dons/types/donation";

export function createIdempotencyKey() {
  return randomUUID();
}

export function createInternalPaymentReference() {
  return `AFD-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

/**
 * Prépare une transaction carte liée à une intention.
 * Ne marque jamais `confirmed` sans vérification serveur + webhook signé.
 * Inactif tant que CARD_PAYMENT_ENABLED=false / contrat AFD manquant.
 */
export async function initiatePaymentForIntent(
  intent: DonationIntent,
): Promise<{ transaction: PaymentTransaction; error?: string }> {
  const now = new Date().toISOString();
  const internalReference = createInternalPaymentReference();
  const idempotencyKey = createIdempotencyKey();
  const config = getCardPaymentConfig();

  const transaction: PaymentTransaction = {
    id: randomUUID(),
    donation_intent_id: intent.id,
    internal_reference: internalReference,
    provider: "card",
    provider_reference: null,
    amount: intent.amount,
    currency: intent.currency,
    status: "created",
    payment_method: "card",
    provider_status: null,
    provider_response: null,
    webhook_verified: false,
    confirmed_at: null,
    failed_at: null,
    created_at: now,
    updated_at: now,
  };

  if (!config.configured) {
    const message = new CardPaymentNotConfiguredError().message;
    return {
      transaction: {
        ...transaction,
        status: "failed",
        failed_at: now,
        updated_at: now,
        provider_response: { error: message },
      },
      error: message,
    };
  }

  try {
    await cardPaymentProvider.createPayment({
      amount: intent.amount,
      currency: intent.currency,
      internalReference,
      idempotencyKey,
      description: `Don AFD ${internalReference}`,
      customer: {
        name: intent.donor_name,
        email: intent.donor_email,
        phone: intent.donor_phone ?? undefined,
        country: intent.donor_country ?? undefined,
      },
      returnUrl: config.returnUrl,
      callbackUrl: config.callbackUrl,
    });
  } catch (error) {
    const message =
      error instanceof CardPaymentNotConfiguredError
        ? error.message
        : "Échec d’initialisation du paiement carte";

    return {
      transaction: {
        ...transaction,
        status: "failed",
        failed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        provider_response: { error: message },
      },
      error: message,
    };
  }

  return { transaction };
}

export async function getPaymentStatusByReference(reference: string) {
  void reference;
  return null as PaymentTransaction | null;
}
