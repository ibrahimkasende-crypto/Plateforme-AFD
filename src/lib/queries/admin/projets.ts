import type { Database } from "@/types/database.types";
import { createClientSafe } from "@/lib/supabase/safe";

export type Projet = Database["public"]["Tables"]["projets"]["Row"];
export type ProjetStatus = "en_cours" | "termine" | "futur";

export async function getAdminProjets(filters: { q?: string; statut?: string; program_id?: string } = {}): Promise<Projet[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("projets").select("*");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%,location.ilike.%${q}%`);
    }
    if (filters.statut?.trim()) query = query.eq("status", filters.statut.trim());
    if (filters.program_id?.trim()) query = query.eq("program_id", filters.program_id.trim());
    const { data, error } = await query.order("updated_at", { ascending: false });
    return error || !data ? [] : data;
  } catch {
    return [];
  }
}

export async function getAdminProjet(id: string): Promise<Projet | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase.from("projets").select("*").eq("id", id).maybeSingle();
    return error || !data ? null : data;
  } catch {
    return null;
  }
}

export async function getProjetOptions(): Promise<Array<{ id: string; title: string }>> {
  const items = await getAdminProjets();
  return items.map((p) => ({ id: p.id, title: p.title }));
}
