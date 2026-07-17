import type { Database } from "@/types/database.types";
import { createClientSafe } from "@/lib/supabase/safe";

export type PartnershipRequestInsert = {
  organization: string;
  contact_name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
};

type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];

export type PartnershipMutationResult =
  | { ok: true }
  | { ok: false; reason: "unavailable" | "insert_failed" };

/**
 * Enregistre une demande de partenariat via `messages`
 * (préfixe métier) en l’absence de table dédiée.
 */
export async function submitPartnershipRequest(
  input: PartnershipRequestInsert,
): Promise<PartnershipMutationResult> {
  const supabase = await createClientSafe();
  if (!supabase) {
    return { ok: false, reason: "unavailable" };
  }

  const payload: MessageInsert = {
    name: input.contact_name,
    email: input.email,
    phone: input.phone?.trim() || null,
    subject: input.subject,
    message: input.message,
    status: "pending",
  };

  const { error } = await supabase.from("messages").insert(payload);
  if (error) {
    return { ok: false, reason: "insert_failed" };
  }

  return { ok: true };
}
