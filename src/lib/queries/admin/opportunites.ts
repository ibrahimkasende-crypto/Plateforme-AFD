import type { Opportunity, OpportunityStatus } from "@/features/opportunites/types";
import { createClientSafe } from "@/lib/supabase/safe";

export async function getAdminOpportunities(filters: { q?: string; statut?: string } = {}): Promise<Opportunity[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("opportunites").select("*").is("deleted_at", null);
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`titre.ilike.%${q}%,slug.ilike.%${q}%`);
    }
    if (filters.statut?.trim()) query = query.eq("statut", filters.statut.trim() as OpportunityStatus);
    const { data, error } = await query.order("updated_at", { ascending: false });
    return error || !data ? [] : data;
  } catch { return []; }
}

export async function getAdminOpportunity(id: string): Promise<Opportunity | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase.from("opportunites").select("*").eq("id", id).maybeSingle();
    return error || !data ? null : data;
  } catch { return null; }
}
