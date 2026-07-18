import type { Opportunity } from "@/features/opportunites/types";
import { createClientSafe } from "@/lib/supabase/safe";

export async function getAdminOpportunities(): Promise<Opportunity[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    const { data, error } = await supabase.from("opportunites").select("*").is("deleted_at", null).order("updated_at", { ascending: false });
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
