import type { Database } from "@/types/database.types";
import { createClientSafe } from "@/lib/supabase/safe";

export type Don = Database["public"]["Tables"]["dons"]["Row"];

export async function getAdminDons(filters: {
  q?: string;
  status?: string;
} = {}): Promise<Don[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("dons").select("*");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`donor_name.ilike.%${q}%,donor_email.ilike.%${q}%`);
    }
    if (filters.status?.trim()) {
      query = query.eq("status", filters.status);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    return error || !data ? [] : data;
  } catch {
    return [];
  }
}

export async function getAdminDonIntentions(): Promise<Don[]> {
  return getAdminDons({ status: "pending" });
}

export async function getAdminDonTransactions(): Promise<Don[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("dons")
      .select("*")
      .in("status", ["completed", "paid", "confirmed"])
      .order("created_at", { ascending: false });
    return error || !data ? [] : data;
  } catch {
    return [];
  }
}

export async function getAdminDonRemboursements(): Promise<Don[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("dons")
      .select("*")
      .in("status", ["refunded", "rembourse", "cancelled"])
      .order("created_at", { ascending: false });
    return error || !data ? [] : data;
  } catch {
    return [];
  }
}
