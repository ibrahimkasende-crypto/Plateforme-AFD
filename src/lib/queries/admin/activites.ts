import { createClientSafe } from "@/lib/supabase/safe";

export type Activite = {
  id: string;
  projet_id: string | null;
  programme_id: string | null;
  type: string;
  title: string;
  description: string | null;
  activity_date: string | null;
  province: string | null;
  location: string | null;
  femmes: number;
  hommes: number;
  enfants: number;
  jeunes: number;
  total: number;
  status: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getAdminActivites(filters: {
  q?: string;
  status?: string;
} = {}): Promise<Activite[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("activites" as never).select("*");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`title.ilike.%${q}%,province.ilike.%${q}%,type.ilike.%${q}%`);
    }
    if (filters.status?.trim()) {
      query = query.eq("status", filters.status);
    }
    const { data, error } = await query
      .order("activity_date", { ascending: false })
      .order("created_at", { ascending: false });
    return error || !data ? [] : (data as Activite[]);
  } catch {
    return [];
  }
}

export async function getAdminActivite(id: string): Promise<Activite | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase.from("activites" as never).select("*").eq("id", id).maybeSingle();
    return error || !data ? null : (data as Activite);
  } catch {
    return null;
  }
}
