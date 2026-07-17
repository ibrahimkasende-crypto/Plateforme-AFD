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
    return { ok: false, reason: "insert_failed" };
  }

  return { ok: true };
}
