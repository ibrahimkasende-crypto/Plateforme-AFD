import {
  subscribeToNewsletter,
  type NewsletterSubscribeResult,
} from "@/features/newsletter/services/newsletter.service";

export type NewsletterSubscribeInsert = {
  email: string;
  firstName?: string | null;
  preferences?: string[] | null;
  source?: string | null;
};

/**
 * Mutation publique newsletter — délègue au service centralisé
 * (table `abonnes_newsletter` hors types générés tant que non régénérés).
 */
export async function subscribeNewsletter(
  input: NewsletterSubscribeInsert,
): Promise<NewsletterSubscribeResult> {
  return subscribeToNewsletter({
    email: input.email,
    firstName: input.firstName ?? undefined,
    preferences: input.preferences ?? [],
    consent: true,
    source: input.source ?? undefined,
  });
}
