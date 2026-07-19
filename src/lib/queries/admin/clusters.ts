import { createClientSafe } from "@/lib/supabase/safe";

export type Cluster = {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
  icon: string | null;
  order: number | null;
  active: boolean;
  is_demo?: boolean | null;
  demo_batch_id?: string | null;
};

export async function getAdminClusters(filters: { q?: string } = {}): Promise<Cluster[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("clusters" as never).select("*");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`name.ilike.%${q}%,type.ilike.%${q}%`);
    }
    const { data, error } = await query.order("order", { ascending: true }).order("name");
    return error || !data ? [] : (data as Cluster[]);
  } catch {
    return [];
  }
}

export async function getAdminCluster(id: string): Promise<Cluster | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("clusters" as never)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return error || !data ? null : (data as Cluster);
  } catch {
    return null;
  }
}
