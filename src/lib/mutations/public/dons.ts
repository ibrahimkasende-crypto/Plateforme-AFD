import type { Database } from "@/types/database.types";
import { createClientSafe } from "@/lib/supabase/safe";

export type DonationIntentInsert = {
  donor_name: string;
  donor_email: string;
  donor_phone?: string | null;
  amount: number;
  currency: string;
  payment_method?: string | null;
  status: "intent" | "pending";
};

type DonInsert = Database["public"]["Tables"]["dons"]["Insert"];

export type DonationMutationResult =
  | { ok: true; donationId: string }
  | { ok: false; reason: "unavailable" | "insert_failed" };

/**
 * Enregistre une intention de don.
 * Ne confirme jamais un paiement — statut `intent` ou `pending` uniquement.
 */
export async function createDonationIntent(
  input: DonationIntentInsert,
): Promise<DonationMutationResult> {
  const supabase = await createClientSafe();
  if (!supabase) {
    return { ok: false, reason: "unavailable" };
  }

  const payload: DonInsert = {
    donor_name: input.donor_name,
    donor_email: input.donor_email,
    donor_phone: input.donor_phone?.trim() || null,
    amount: input.amount,
    currency: input.currency,
    payment_method: input.payment_method ?? "serdipay",
    status: input.status,
  };

  const { data, error } = await supabase
    .from("dons")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, reason: "insert_failed" };
  }

  return { ok: true, donationId: data.id };
}
