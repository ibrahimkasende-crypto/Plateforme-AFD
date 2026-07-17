import { randomUUID } from "crypto";
import {
  SerdiPayNotConfiguredError,
  serdiPayProvider,
} from "@/features/paiements/providers/serdipay";
import type { PaymentTransaction } from "@/features/dons/types/donation";
import type { DonationIntent } from "@/features/dons/types/donation";

export function createIdempotencyKey() {
  return randomUUID();
}

export function createInternalPaymentReference() {
  return `ADF-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

/**
 * Prépare une transaction liée à une intention.
 * Ne marque jamais `confirmed` sans vérification serveur SerdiPay.
 */
export async function initiatePaymentForIntent(
  intent: DonationIntent,
): Promise<{ transaction: PaymentTransaction; error?: string }> {
  const now = new Date().toISOString();
  const internalReference = createInternalPaymentReference();
  const idempotencyKey = createIdempotencyKey();

  const transaction: PaymentTransaction = {
    id: randomUUID(),
    donation_intent_id: intent.id,
    internal_reference: internalReference,
    provider: "serdipay",
    provider_reference: null,
    amount: intent.amount,
    currency: intent.currency,
    status: "created",
    payment_method: null,
    provider_status: null,
    provider_response: null,
    webhook_verified: false,
    confirmed_at: null,
    failed_at: null,
    created_at: now,
    updated_at: now,
  };

  try {
    await serdiPayProvider.createPayment({
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
      returnUrl: process.env.SERDIPAY_RETURN_URL ?? "",
      callbackUrl: process.env.SERDIPAY_CALLBACK_URL ?? "",
    });
  } catch (error) {
    const message =
      error instanceof SerdiPayNotConfiguredError
        ? error.message
        : "Échec d’initialisation du paiement";

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
