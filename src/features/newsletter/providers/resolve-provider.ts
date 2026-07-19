import "server-only";

import type { NewsletterProvider } from "@/features/newsletter/types/provider";
import { NewsletterProviderNotConfiguredError } from "@/features/newsletter/types/provider";

export type EmailProviderConfig = {
  provider: string;
  apiKey: string;
  from: string;
  replyTo?: string;
};

export function getEmailProviderConfig(): EmailProviderConfig | null {
  const provider = process.env.EMAIL_PROVIDER?.trim();
  const apiKey = process.env.EMAIL_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (!provider || !apiKey || !from) return null;
  return {
    provider,
    apiKey,
    from,
    replyTo: process.env.EMAIL_REPLY_TO?.trim() || undefined,
  };
}

export function isEmailProviderConfigured(): boolean {
  return getEmailProviderConfig() !== null;
}

/**
 * Résout le fournisseur d’envoi. Sans configuration complète → erreur explicite.
 * Aucun mock de succès en production.
 */
export function resolveNewsletterProvider(): NewsletterProvider {
  const config = getEmailProviderConfig();
  if (!config) {
    throw new NewsletterProviderNotConfiguredError(
      "Configuration requise : EMAIL_PROVIDER, EMAIL_API_KEY, EMAIL_FROM",
    );
  }
  // Adaptateurs réels à brancher quand les clés officielles sont fournies.
  // Ne pas inventer d’endpoint ni simuler un envoi réussi.
  throw new NewsletterProviderNotConfiguredError(
    `Fournisseur « ${config.provider} » déclaré mais adaptateur non activé — Configuration requise côté AFD.`,
  );
}
