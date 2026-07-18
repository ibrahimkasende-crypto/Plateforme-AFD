import type { Database } from "@/types/database.types";
import { createClientSafe } from "@/lib/supabase/safe";

export type Cluster = Database["public"]["Tables"]["clusters"]["Row"];

export async function getAdminClusters(filters: { q?: string } = {}): Promise<Cluster[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("clusters").select("*");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`name.ilike.%${q}%,type.ilike.%${q}%`);
    }
    const { data, error } = await query.order("order", { ascending: true }).order("name");
    return error || !data ? [] : data;
  } catch {
    return [];
  }
}

export async function getAdminCluster(id: string): Promise<Cluster | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase.from("clusters").select("*").eq("id", id).maybeSingle();
    return error || !data ? null : data;
  } catch {
    return null;
  }
}
