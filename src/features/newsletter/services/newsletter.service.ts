import {
  NewsletterProviderNotConfiguredError,
  type NewsletterProvider,
} from "@/features/newsletter/types/provider";
import type {
  NewsletterCampaignInput,
  NewsletterSubscriberInput,
} from "@/features/newsletter/schemas/newsletter";

let emailProvider: NewsletterProvider | null = null;

export function setNewsletterProvider(provider: NewsletterProvider) {
  emailProvider = provider;
}

export async function subscribeToNewsletter(
  input: NewsletterSubscriberInput,
): Promise<{ ok: true; status: "prepared"; email: string }> {
  // TODO: persister dans abonnes_newsletter via repository Supabase.
  return { ok: true, status: "prepared", email: input.email };
}

export async function unsubscribeFromNewsletter(
  email: string,
): Promise<{ ok: true; status: "prepared"; email: string }> {
  return { ok: true, status: "prepared", email };
}

export async function updateNewsletterPreferences(
  email: string,
  preferences: string[],
): Promise<{ ok: true; status: "prepared"; email: string; count: number }> {
  return { ok: true, status: "prepared", email, count: preferences.length };
}

export async function createNewsletterCampaign(
  input: NewsletterCampaignInput,
): Promise<{ ok: true; status: "prepared"; name: string }> {
  return { ok: true, status: "prepared", name: input.name };
}

export async function sendNewsletterCampaign(
  campaignId: string,
): Promise<never> {
  void campaignId;
  if (!emailProvider) {
    throw new NewsletterProviderNotConfiguredError();
  }
  throw new NewsletterProviderNotConfiguredError(
    "Envoi newsletter non activé — aucun provider réel branché.",
  );
}

export async function getNewsletterStatistics(): Promise<{
  subscribers: number | null;
  campaigns: number | null;
  notice: string;
}> {
  return {
    subscribers: null,
    campaigns: null,
    notice: "Statistiques newsletter non connectées — aucune donnée fictive.",
  };
}
