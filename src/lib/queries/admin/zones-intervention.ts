import { createClientSafe } from "@/lib/supabase/safe";

export type ZoneIntervention = {
  id: string;
  province: string;
  main_locality: string | null;
  svg_id: string | null;
  color: string | null;
  active: boolean;
  summary: string | null;
  image_url: string | null;
  projects_count: number | null;
  activities_count: number | null;
  beneficiaries_count: number | null;
  sectors: string[];
  is_demo: boolean;
  status: "brouillon" | "publie" | "archive";
  updated_at: string;
  created_at: string;
};

export async function getAdminZones(filters: { q?: string; status?: string } = {}): Promise<ZoneIntervention[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("zones_intervention" as never).select("*");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`province.ilike.%${q}%,main_locality.ilike.%${q}%`);
    }
    if (filters.status?.trim()) query = query.eq("status", filters.status.trim());
    const { data, error } = await query.order("province", { ascending: true });
    return error || !data ? [] : (data as unknown as ZoneIntervention[]);
  } catch {
    return [];
  }
}

export async function getAdminZone(id: string): Promise<ZoneIntervention | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("zones_intervention" as never)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return error || !data ? null : (data as unknown as ZoneIntervention);
  } catch {
    return null;
  }
}
