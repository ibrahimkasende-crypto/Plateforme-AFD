import { createClientSafe } from "@/lib/supabase/safe";

export type Urgence = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  status: string;
  province: string | null;
  started_at: string | null;
  ended_at: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getAdminUrgences(filters: {
  q?: string;
  status?: string;
} = {}): Promise<Urgence[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("urgences" as never).select("*");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`title.ilike.%${q}%,province.ilike.%${q}%`);
    }
    if (filters.status?.trim()) {
      query = query.eq("status", filters.status);
    }
    const { data, error } = await query.order("started_at", { ascending: false });
    return error || !data ? [] : (data as Urgence[]);
  } catch {
    return [];
  }
}

export async function getAdminUrgence(id: string): Promise<Urgence | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase.from("urgences" as never).select("*").eq("id", id).maybeSingle();
    return error || !data ? null : (data as Urgence);
  } catch {
    return null;
  }
}
