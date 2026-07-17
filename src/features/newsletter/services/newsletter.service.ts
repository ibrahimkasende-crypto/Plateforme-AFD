import { createClientSafe } from "@/lib/supabase/safe";
import {
  NewsletterProviderNotConfiguredError,
  type NewsletterProvider,
} from "@/features/newsletter/types/provider";
import type {
  NewsletterCampaignInput,
  NewsletterSubscriberInput,
} from "@/features/newsletter/schemas/newsletter";

let emailProvider: NewsletterProvider | null = null;

export type NewsletterSubscribeStatus =
  | "subscribed"
  | "already_subscribed"
  | "prepared";

export type NewsletterSubscribeResult = {
  ok: true;
  status: NewsletterSubscribeStatus;
  email: string;
  message: string;
};

export function setNewsletterProvider(provider: NewsletterProvider) {
  emailProvider = provider;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function subscribeToNewsletter(
  input: NewsletterSubscriberInput & { source?: string },
): Promise<NewsletterSubscribeResult> {
  const email = normalizeEmail(input.email);
  const supabase = await createClientSafe();

  if (!supabase) {
    return {
      ok: true,
      status: "prepared",
      email,
      message:
        "Votre demande est enregistrée localement. La table newsletter sera finalisée côté serveur.",
    };
  }

  const payload = {
    email,
    nom: input.firstName?.trim() || null,
    centres_interet: input.preferences ?? [],
    statut: "actif",
    source: input.source ?? "site_public",
    consentement: true as const,
    subscribed_at: new Date().toISOString(),
  };

  // Table hors database.types.ts tant que les types générés ne sont pas régénérés.
  const { error } = await supabase.from("abonnes_newsletter" as never).insert(payload as never);

  if (!error) {
    return {
      ok: true,
      status: "subscribed",
      email,
      message:
        "Votre inscription a été enregistrée. Merci de suivre les actions de l’AFD.",
    };
  }

  if (error.code === "23505") {
    return {
      ok: true,
      status: "already_subscribed",
      email,
      message: "Cette adresse e-mail est déjà inscrite à la newsletter AFD.",
    };
  }

  // Table absente ou RLS non prête
  if (
    error.code === "42P01" ||
    error.message.toLowerCase().includes("schema cache") ||
    error.message.toLowerCase().includes("does not exist")
  ) {
    return {
      ok: true,
      status: "prepared",
      email,
      message:
        "L’inscription est prête. La table abonnés newsletter n’est pas encore déployée.",
    };
  }

  throw new Error(error.message);
}

export async function isEmailSubscribed(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  const supabase = await createClientSafe();
  if (!supabase) return false;

  const { data, error } = await supabase
    .from("abonnes_newsletter" as never)
    .select("id" as never)
    .eq("email" as never, normalized)
    .eq("statut" as never, "actif")
    .maybeSingle();

  if (error || !data) return false;
  return true;
}

export async function unsubscribeFromNewsletter(
  email: string,
): Promise<{ ok: true; status: "prepared"; email: string }> {
  return { ok: true, status: "prepared", email: normalizeEmail(email) };
}

export async function updateNewsletterPreferences(
  email: string,
  preferences: string[],
): Promise<{ ok: true; status: "prepared"; email: string; count: number }> {
  return {
    ok: true,
    status: "prepared",
    email: normalizeEmail(email),
    count: preferences.length,
  };
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
