import type { AppelOffre, AppelOffreStatut } from "@/features/appels-offres/types";
import { createClientSafe } from "@/lib/supabase/safe";

export async function getAdminAppelsOffres(filters: {
  q?: string;
  statut?: string;
} = {}): Promise<AppelOffre[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("appels_offres").select("*").is("deleted_at", null);
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`titre.ilike.%${q}%,slug.ilike.%${q}%`);
    }
    if (filters.statut?.trim()) {
      query = query.eq("statut", filters.statut.trim() as AppelOffreStatut);
    }
    const { data, error } = await query.order("updated_at", { ascending: false });
    return error || !data ? [] : (data as AppelOffre[]);
  } catch {
    return [];
  }
}

export async function getAdminAppelOffre(id: string): Promise<AppelOffre | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("appels_offres")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return error || !data ? null : (data as AppelOffre);
  } catch {
    return null;
  }
}
