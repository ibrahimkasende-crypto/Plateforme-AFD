import type { HistoireImpact, PublicationStatus } from "@/features/impact/types";
import { createClientSafe } from "@/lib/supabase/safe";

export async function getAdminHistoires(filters: {
  q?: string;
  status?: string;
} = {}): Promise<HistoireImpact[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("histoires_impact").select("*").is("deleted_at", null);
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%`);
    }
    if (filters.status?.trim()) {
      query = query.eq("status", filters.status.trim() as PublicationStatus);
    }
    const { data, error } = await query.order("updated_at", { ascending: false });
    return error || !data ? [] : (data as HistoireImpact[]);
  } catch {
    return [];
  }
}

export async function getAdminHistoire(id: string): Promise<HistoireImpact | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("histoires_impact")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return error || !data ? null : (data as HistoireImpact);
  } catch {
    return null;
  }
}
