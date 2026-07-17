export type SerdiPayEnvironment = "sandbox" | "production" | "";

export type SerdiPayConfig = {
  environment: SerdiPayEnvironment;
  baseUrl: string;
  merchantId: string;
  apiKey: string;
  apiSecret: string;
  webhookSecret: string;
  callbackUrl: string;
  returnUrl: string;
  defaultCurrency: string;
  configured: boolean;
};

/**
 * Charge la configuration SerdiPay côté serveur uniquement.
 * Aucune variable privée n’est préfixée NEXT_PUBLIC_.
 *
 * TODO SerdiPay: confirmer les noms exacts des variables et endpoints officiels.
 */
export function getSerdiPayConfig(): SerdiPayConfig {
  const environment = (process.env.SERDIPAY_ENVIRONMENT ?? "") as SerdiPayEnvironment;
  const baseUrl = process.env.SERDIPAY_BASE_URL ?? "";
  const merchantId = process.env.SERDIPAY_MERCHANT_ID ?? "";
  const apiKey = process.env.SERDIPAY_API_KEY ?? "";
  const apiSecret = process.env.SERDIPAY_API_SECRET ?? "";
  const webhookSecret = process.env.SERDIPAY_WEBHOOK_SECRET ?? "";
  const callbackUrl = process.env.SERDIPAY_CALLBACK_URL ?? "";
  const returnUrl = process.env.SERDIPAY_RETURN_URL ?? "";
  const defaultCurrency = process.env.SERDIPAY_DEFAULT_CURRENCY ?? "USD";

  const configured = Boolean(
    baseUrl && merchantId && apiKey && apiSecret && webhookSecret,
  );

  return {
    environment,
    baseUrl,
    merchantId,
    apiKey,
    apiSecret,
    webhookSecret,
    callbackUrl,
    returnUrl,
    defaultCurrency,
    configured,
  };
}

export class SerdiPayNotConfiguredError extends Error {
  constructor(message = "SerdiPay n’est pas encore configuré") {
    super(message);
    this.name = "SerdiPayNotConfiguredError";
  }
}
