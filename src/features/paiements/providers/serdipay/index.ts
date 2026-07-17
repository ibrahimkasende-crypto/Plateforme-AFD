import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
  PaymentStatusResult,
  RefundPaymentInput,
  RefundPaymentResult,
  WebhookVerificationInput,
  WebhookVerificationResult,
} from "@/features/paiements/types/payment-provider";
import { SerdiPayNotConfiguredError, getSerdiPayConfig } from "./config";
import { mapSerdiPayStatus } from "./mapper";

/**
 * Fournisseur SerdiPay.
 * Tant que la documentation officielle n’est pas intégrée,
 * toutes les opérations sensibles échouent explicitement.
 */
export const serdiPayProvider: PaymentProvider = {
  name: "serdipay",

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    void input;
    const config = getSerdiPayConfig();
    if (!config.configured) {
      throw new SerdiPayNotConfiguredError();
    }
    throw new SerdiPayNotConfiguredError(
      "SerdiPay n’est pas encore configuré : endpoint de création manquant.",
    );
  },

  async getPaymentStatus(
    providerReference: string,
  ): Promise<PaymentStatusResult> {
    void providerReference;
    const config = getSerdiPayConfig();
    if (!config.configured) {
      throw new SerdiPayNotConfiguredError();
    }
    throw new SerdiPayNotConfiguredError(
      "SerdiPay n’est pas encore configuré : endpoint de vérification manquant.",
    );
  },

  async verifyWebhook(
    input: WebhookVerificationInput,
  ): Promise<WebhookVerificationResult> {
    void input;
    const config = getSerdiPayConfig();
    if (!config.configured) {
      return {
        valid: false,
        raw: { error: "SerdiPay n’est pas encore configuré" },
      };
    }

    // TODO SerdiPay: vérifier la signature officielle du webhook.
    return {
      valid: false,
      raw: {
        error:
          "Vérification webhook SerdiPay non implémentée — documentation manquante.",
      },
    };
  },

  async refundPayment(
    input: RefundPaymentInput,
  ): Promise<RefundPaymentResult> {
    void input;
    throw new SerdiPayNotConfiguredError(
      "SerdiPay n’est pas encore configuré : remboursements non documentés.",
    );
  },

  normalizeStatus(providerStatus: string) {
    return mapSerdiPayStatus(providerStatus);
  },
};

export { getSerdiPayConfig, SerdiPayNotConfiguredError } from "./config";
export { mapSerdiPayStatus } from "./mapper";
