/**
 * Configuration paiement carte AFD (serveur uniquement).
 *
 * Provider envisagé pour étude : Equity BCDC Eazzy e-Commerce / CyberSource.
 * Aucun endpoint, secret ou identifiant inventé ici.
 *
 * Tant que le contrat marchand AFD n’est pas disponible :
 * CARD_PAYMENT_ENABLED=false
 */

export type CardPaymentConfig = {
  enabled: boolean;
  /** Identifiant logique du prestataire (ex. eazzy_ecommerce) — vide tant que non choisi. */
  providerId: string;
  merchantId: string;
  apiBaseUrl: string;
  apiKeyConfigured: boolean;
  apiSecretConfigured: boolean;
  webhookSecretConfigured: boolean;
  callbackUrl: string;
  returnUrl: string;
  defaultCurrency: string;
  /** true seulement si enabled + merchant + clés + webhook + URLs présents */
  configured: boolean;
};

function truthy(value: string | undefined): boolean {
  return /^(1|true|yes|on)$/i.test((value ?? "").trim());
}

export function getCardPaymentConfig(): CardPaymentConfig {
  const enabled = truthy(process.env.CARD_PAYMENT_ENABLED);
  const providerId = (process.env.CARD_PAYMENT_PROVIDER_ID ?? "").trim();
  const merchantId = (process.env.CARD_PAYMENT_MERCHANT_ID ?? "").trim();
  const apiBaseUrl = (process.env.CARD_PAYMENT_BASE_URL ?? "").trim();
  const apiKey = (process.env.CARD_PAYMENT_API_KEY ?? "").trim();
  const apiSecret = (process.env.CARD_PAYMENT_API_SECRET ?? "").trim();
  const webhookSecret = (process.env.CARD_PAYMENT_WEBHOOK_SECRET ?? "").trim();
  const callbackUrl = (process.env.CARD_PAYMENT_CALLBACK_URL ?? "").trim();
  const returnUrl = (process.env.CARD_PAYMENT_RETURN_URL ?? "").trim();
  const defaultCurrency = (process.env.CARD_PAYMENT_DEFAULT_CURRENCY ?? "USD").trim();

  const apiKeyConfigured = apiKey.length > 0;
  const apiSecretConfigured = apiSecret.length > 0;
  const webhookSecretConfigured = webhookSecret.length > 0;

  const configured = Boolean(
    enabled &&
      providerId &&
      merchantId &&
      apiBaseUrl &&
      apiKeyConfigured &&
      apiSecretConfigured &&
      webhookSecretConfigured &&
      callbackUrl &&
      returnUrl,
  );

  return {
    enabled,
    providerId,
    merchantId,
    apiBaseUrl,
    apiKeyConfigured,
    apiSecretConfigured,
    webhookSecretConfigured,
    callbackUrl,
    returnUrl,
    defaultCurrency,
    configured,
  };
}

export class CardPaymentNotConfiguredError extends Error {
  constructor(
    message = "Le paiement par carte n’est pas encore activé pour l’AFD (contrat marchand manquant).",
  ) {
    super(message);
    this.name = "CardPaymentNotConfiguredError";
  }
}

export function isCardPaymentPubliclyAvailable(): boolean {
  return getCardPaymentConfig().configured;
}
