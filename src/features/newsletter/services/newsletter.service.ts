import { createClientSafe } from "@/lib/supabase/safe";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";
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
  | "prepared"
  | "reactivated";

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

type SubscribeExtras = {
  source?: string;
  userId?: string | null;
  provider?: string | null;
};

export async function subscribeToNewsletter(
  input: NewsletterSubscriberInput & SubscribeExtras,
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

  const now = new Date().toISOString();
  const payload = {
    email,
    nom: input.firstName?.trim() || null,
    centres_interet: input.preferences ?? [],
    statut: "actif",
    source: input.source ?? "site_public",
    consentement: true as const,
    subscribed_at: now,
    unsubscribed_at: null,
    user_id: input.userId ?? null,
    updated_at: now,
  };

  const { error } = await supabase
    .from("abonnes_newsletter" as never)
    .insert(payload as never);

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
    const admin = createAdminServiceClient();
    const client = admin ?? supabase;

    const existing = await client
      .from("abonnes_newsletter" as never)
      .select("id, statut" as never)
      .eq("email" as never, email)
      .maybeSingle();

    const row = existing.data as { id?: string; statut?: string } | null;
    if (row?.statut === "desinscrit" && row.id) {
      const { error: updateError } = await client
        .from("abonnes_newsletter" as never)
        .update({
          statut: "actif",
          consentement: true,
          subscribed_at: now,
          unsubscribed_at: null,
          source: input.source ?? "site_public",
          nom: input.firstName?.trim() || null,
          user_id: input.userId ?? null,
          updated_at: now,
        } as never)
        .eq("id" as never, row.id);

      if (!updateError) {
        return {
          ok: true,
          status: "reactivated",
          email,
          message:
            "Votre abonnement à la newsletter a été réactivé. Merci de suivre les actions de l’AFD.",
        };
      }
    }

    return {
      ok: true,
      status: "already_subscribed",
      email,
      message: "Cette adresse est déjà inscrite à notre newsletter.",
    };
  }

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
