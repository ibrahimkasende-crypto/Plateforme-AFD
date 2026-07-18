import type { Temoignage } from "@/features/impact/types";
import { createClientSafe } from "@/lib/supabase/safe";

export async function getAdminTemoignages(filters: {
  q?: string;
} = {}): Promise<Temoignage[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("temoignages").select("*").is("deleted_at", null);
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`display_name.ilike.%${q}%,quote.ilike.%${q}%`);
    }
    const { data, error } = await query
      .order("order_index", { ascending: true })
      .order("updated_at", { ascending: false });
    return error || !data ? [] : (data as Temoignage[]);
  } catch {
    return [];
  }
}

export async function getAdminTemoignage(id: string): Promise<Temoignage | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("temoignages")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return error || !data ? null : (data as Temoignage);
  } catch {
    return null;
  }
}
