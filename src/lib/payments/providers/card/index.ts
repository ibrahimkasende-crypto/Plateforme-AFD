import type { PaymentProvider } from "@/lib/payments/types";
import {
  CardPaymentNotConfiguredError,
  getCardPaymentConfig,
} from "@/lib/payments/providers/card/config";
import { mapCardProviderStatus } from "@/lib/payments/providers/card/mapper";

/**
 * Provider carte générique AFD.
 *
 * Ne contient aucun appel API inventé.
 * Ne référence pas SerdiPay ni Campus Food.
 * Activation réelle uniquement après contrat + credentials AFD
 * (étude prioritaire : Equity BCDC Eazzy e-Commerce / CyberSource).
 */
export const cardPaymentProvider: PaymentProvider = {
  name: "card",

  async createPayment() {
    const config = getCardPaymentConfig();
    if (!config.configured) {
      throw new CardPaymentNotConfiguredError();
    }
    throw new CardPaymentNotConfiguredError(
      "Paiement carte AFD : endpoints officiels du prestataire non branchés (documentation marchand requise).",
    );
  },

  async getPaymentStatus() {
    const config = getCardPaymentConfig();
    if (!config.configured) {
      throw new CardPaymentNotConfiguredError();
    }
    throw new CardPaymentNotConfiguredError(
      "Vérification statut carte AFD : endpoints officiels non branchés.",
    );
  },

  async verifyWebhook() {
    const config = getCardPaymentConfig();
    if (!config.configured) {
      return {
        valid: false,
        raw: { error: "Paiement carte AFD non configuré" },
      };
    }
    return {
      valid: false,
      raw: {
        error:
          "Vérification webhook carte non implémentée — documentation prestataire AFD manquante.",
      },
    };
  },

  async refundPayment() {
    throw new CardPaymentNotConfiguredError(
      "Remboursements carte AFD non documentés / non activés.",
    );
  },

  normalizeStatus(providerStatus: string) {
    return mapCardProviderStatus(providerStatus);
  },
};

export { getCardPaymentConfig, CardPaymentNotConfiguredError, isCardPaymentPubliclyAvailable } from "./config";
export { mapCardProviderStatus } from "./mapper";
