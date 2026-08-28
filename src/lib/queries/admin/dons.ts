import type { Database } from "@/types/database.types";
import { createClientSafe } from "@/lib/supabase/safe";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";

export type Don = Database["public"]["Tables"]["dons"]["Row"];
export type DonProof = Database["public"]["Tables"]["dons_preuves"]["Row"];
export type DonStatusHistory = Database["public"]["Tables"]["dons_status_history"]["Row"];

async function client() {
  return createAdminServiceClient() ?? (await createClientSafe());
}

export async function getAdminDons(filters: {
  q?: string;
  status?: string;
} = {}): Promise<Don[]> {
  try {
    const supabase = await client();
    if (!supabase) return [];
    let query = supabase.from("dons").select("*");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(
        `donor_name.ilike.%${q}%,donor_email.ilike.%${q}%,reference.ilike.%${q}%`,
      );
    }
    if (filters.status?.trim()) {
      if (filters.status === "verified") {
        query = query.in("status", ["verified", "confirmed"]);
      } else {
        query = query.eq("status", filters.status);
      }
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    return error || !data ? [] : data;
  } catch {
    return [];
  }
}

export async function getAdminDonById(id: string): Promise<Don | null> {
  try {
    const supabase = await client();
    if (!supabase) return null;
    const { data, error } = await supabase.from("dons").select("*").eq("id", id).maybeSingle();
    return error || !data ? null : data;
  } catch {
    return null;
  }
}

export async function getDonProofs(donId: string): Promise<DonProof[]> {
  try {
    const supabase = await client();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("dons_preuves")
      .select("*")
      .eq("don_id", donId)
      .order("uploaded_at", { ascending: false });
    return error || !data ? [] : data;
  } catch {
    return [];
  }
}

export async function getDonStatusHistory(donId: string): Promise<DonStatusHistory[]> {
  try {
    const supabase = await client();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("dons_status_history")
      .select("*")
      .eq("don_id", donId)
      .order("created_at", { ascending: false });
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
    const supabase = await client();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("dons")
      .select("*")
      .in("status", ["completed", "paid", "confirmed", "verified"])
      .order("created_at", { ascending: false });
    return error || !data ? [] : data;
  } catch {
    return [];
  }
}

export async function getAdminDonRemboursements(): Promise<Don[]> {
  try {
    const supabase = await client();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("dons")
      .select("*")
      .in("status", ["refunded", "rembourse", "cancelled", "rejected"])
      .order("created_at", { ascending: false });
    return error || !data ? [] : data;
  } catch {
    return [];
  }
}
