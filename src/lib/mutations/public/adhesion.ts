import type { Database } from "@/types/database.types";
import { createClientSafe } from "@/lib/supabase/safe";

export type MembershipRequestInsert = {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  motivation: string;
  member_type?: string | null;
};

type MembreInsert = Database["public"]["Tables"]["membres"]["Insert"];

export type MembershipMutationResult =
  | { ok: true }
  | { ok: false; reason: "unavailable" | "insert_failed" };

export async function submitMembershipRequest(
  input: MembershipRequestInsert,
): Promise<MembershipMutationResult> {
  const supabase = await createClientSafe();
  if (!supabase) {
    return { ok: false, reason: "unavailable" };
  }

  // RPC security definer — fonctionne avec clé publishable (RLS table souvent bloquant).
  const { data: rpcId, error: rpcError } = await supabase.rpc(
    "submit_membership_request" as never,
    {
      p_full_name: input.full_name,
      p_email: input.email,
      p_phone: input.phone,
      p_address: input.address,
      p_gender: input.gender,
      p_motivation: input.motivation,
      p_member_type: input.member_type ?? null,
    } as never,
  );

  if (!rpcError && rpcId) {
    return { ok: true };
  }

  // Fallback insert direct (projets avec clé anon JWT + policy Insert membres).
  const payload: MembreInsert = {
    full_name: input.full_name,
    email: input.email,
    phone: input.phone,
    address: input.address,
    gender: input.gender,
    motivation: input.motivation,
    member_type: input.member_type ?? null,
    status: "pending",
  };

  const { error } = await supabase.from("membres").insert(payload);
  if (error) {
    console.error(
      "[adhesion] insert failed:",
      rpcError?.message ?? error.message,
      error.code,
    );
    return { ok: false, reason: "insert_failed" };
  }

  return { ok: true };
}
