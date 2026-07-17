import {
  getSerdiPayConfig,
  SerdiPayNotConfiguredError,
} from "./config";

/**
 * Client HTTP SerdiPay (serveur uniquement).
 *
 * TODO SerdiPay:
 * - URL sandbox / production officielles
 * - méthode d’authentification (header, HMAC, OAuth…)
 * - endpoints create / status / refund
 * - format exact des requêtes et réponses
 *
 * Aucun endpoint n’est inventé ici.
 */
export function createSerdiPayClient() {
  const config = getSerdiPayConfig();

  if (!config.configured) {
    throw new SerdiPayNotConfiguredError();
  }

  return {
    config,
    /**
     * Placeholder volontaire — n’appelle aucun endpoint inventé.
     */
    async request(): Promise<never> {
      throw new SerdiPayNotConfiguredError(
        "SerdiPay n’est pas encore configuré : endpoints officiels manquants.",
      );
    },
  };
}
