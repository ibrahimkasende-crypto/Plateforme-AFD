import type { Database } from "@/types/database.types";
import { createClientSafe } from "@/lib/supabase/safe";

export type Projet = Database["public"]["Tables"]["projets"]["Row"];
export type ProjetStatus = "en_cours" | "termine" | "futur";

function normalizeProjetStatutFilter(raw: string): string | null {
  const value = raw.trim().toLowerCase();
  if (!value) return null;
  if (["actif", "en_cours", "en-cours", "active", "ongoing"].includes(value)) {
    return "en_cours";
  }
  if (["termine", "terminé", "termines", "terminés", "done"].includes(value)) {
    return "termine";
  }
  if (
    ["futur", "planifie", "planifié", "planifies", "planifiés", "planned"].includes(
      value,
    )
  ) {
    return "futur";
  }
  if (["en_cours", "termine", "futur"].includes(value)) return value;
  return value;
}

export async function getAdminProjets(
  filters: {
    q?: string;
    statut?: string;
    program_id?: string;
    province?: string;
  } = {},
): Promise<Projet[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("projets").select("*");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%,location.ilike.%${q}%`);
    }
    const statut = filters.statut
      ? normalizeProjetStatutFilter(filters.statut)
      : null;
    if (statut) query = query.eq("status", statut);
    if (filters.program_id?.trim()) {
      query = query.eq("program_id", filters.program_id.trim());
    }
    if (filters.province?.trim()) {
      const province = filters.province
        .trim()
        .replace(/-/g, " ")
        .replace(/[%_,]/g, " ")
        .slice(0, 80);
      query = query.ilike("location", `%${province}%`);
    }
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
