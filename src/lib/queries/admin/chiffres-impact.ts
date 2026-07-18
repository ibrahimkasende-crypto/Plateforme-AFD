import { createClientSafe } from "@/lib/supabase/safe";

export type ChiffreImpact = {
  id: string;
  key: string;
  label: string;
  value: number | null;
  unit: string | null;
  suffix: string | null;
  description: string | null;
  icon: string | null;
  order_index: number;
  active: boolean;
  validated: boolean;
  validation_source: string | null;
  reference_period: string | null;
  created_at: string;
  updated_at: string;
};

export async function getAdminChiffresImpact(filters: { q?: string } = {}): Promise<ChiffreImpact[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("chiffres_impact" as never).select("*");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`label.ilike.%${q}%,key.ilike.%${q}%`);
    }
    const { data, error } = await query.order("order_index", { ascending: true }).order("label", { ascending: true });
    return error || !data ? [] : (data as unknown as ChiffreImpact[]);
  } catch {
    return [];
  }
}

export async function getAdminChiffreImpact(id: string): Promise<ChiffreImpact | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("chiffres_impact" as never)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return error || !data ? null : (data as unknown as ChiffreImpact);
  } catch {
    return null;
  }
}
