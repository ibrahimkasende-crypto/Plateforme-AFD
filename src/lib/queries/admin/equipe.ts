import type { Database } from "@/types/database.types";
import { createClientSafe } from "@/lib/supabase/safe";

export type MembreEquipe = Database["public"]["Tables"]["membres_equipe"]["Row"];

export async function getAdminMembresEquipe(filters: { q?: string } = {}): Promise<MembreEquipe[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("membres_equipe").select("*");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`name.ilike.%${q}%,role.ilike.%${q}%`);
    }
    const { data, error } = await query.order("order", { ascending: true }).order("name", { ascending: true });
    return error || !data ? [] : data;
  } catch {
    return [];
  }
}

export async function getAdminMembreEquipe(id: string): Promise<MembreEquipe | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase.from("membres_equipe").select("*").eq("id", id).maybeSingle();
    return error || !data ? null : data;
  } catch {
    return null;
  }
}
