import {
  createDonationIntentSchema,
  type CreateDonationIntentInput,
} from "@/features/dons/schemas/donation-intent";
import type { DonationIntent } from "@/features/dons/types/donation";
import { randomUUID } from "crypto";

/**
 * Crée une intention de don (métier).
 * Ne confirme jamais un paiement.
 */
export async function createDonationIntent(
  raw: CreateDonationIntentInput,
): Promise<DonationIntent> {
  const input = createDonationIntentSchema.parse(raw);
  const now = new Date().toISOString();

  // TODO: persister dans intentions_don (table cible) via Supabase serveur.
  return {
    id: randomUUID(),
    donor_name: input.donor_name,
    donor_email: input.donor_email,
    donor_phone: input.donor_phone ?? null,
    donor_country: input.donor_country ?? null,
    anonymous: input.anonymous,
    support_type: input.support_type,
    programme_id: input.programme_id ?? null,
    project_id: input.project_id ?? null,
    amount: input.amount,
    currency: input.currency,
    message: input.message ?? null,
    status: "submitted",
    created_at: now,
  };
}

export async function listDonationIntents() {
  return [] as DonationIntent[];
}
