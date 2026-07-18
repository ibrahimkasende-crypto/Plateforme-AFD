import { createClientSafe } from "@/lib/supabase/safe";

export type Departement = {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
};

export async function getAdminDepartements(filters: { q?: string } = {}): Promise<Departement[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("departements" as never).select("*");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.ilike("name", `%${q}%`);
    }
    const { data, error } = await query.order("name", { ascending: true });
    return error || !data ? [] : (data as Departement[]);
  } catch {
    return [];
  }
}
