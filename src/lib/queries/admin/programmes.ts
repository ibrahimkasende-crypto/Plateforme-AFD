import type { Database } from "@/types/database.types";
import { createClientSafe } from "@/lib/supabase/safe";

export type Programme = Database["public"]["Tables"]["programmes"]["Row"];

export async function getAdminProgrammes(filters: { q?: string; actif?: string } = {}): Promise<Programme[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("programmes").select("*");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%`);
    }
    if (filters.actif === "1") query = query.eq("active", true);
    if (filters.actif === "0") query = query.eq("active", false);
    const { data, error } = await query.order("order", { ascending: true }).order("title", { ascending: true });
    return error || !data ? [] : data;
  } catch {
    return [];
  }
}

export async function getAdminProgramme(id: string): Promise<Programme | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase.from("programmes").select("*").eq("id", id).maybeSingle();
    return error || !data ? null : data;
  } catch {
    return null;
  }
}

export async function getProgrammeOptions(): Promise<Array<{ id: string; title: string }>> {
  const items = await getAdminProgrammes({ actif: "1" });
  return items.map((p) => ({ id: p.id, title: p.title }));
}
