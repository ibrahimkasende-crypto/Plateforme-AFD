import type { Database } from "@/types/database.types";
import { createClientSafe } from "@/lib/supabase/safe";

export type Adhesion = Database["public"]["Tables"]["membres"]["Row"];

export async function getAdminAdhesions(filters: {
  q?: string;
  status?: string;
} = {}): Promise<Adhesion[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("membres").select("*");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`);
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
