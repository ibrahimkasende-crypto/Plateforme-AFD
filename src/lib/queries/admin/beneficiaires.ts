import { createClientSafe } from "@/lib/supabase/safe";

export type BeneficiaireAgregat = {
  id: string;
  periode: string;
  programme_id: string | null;
  projet_id: string | null;
  province: string | null;
  femmes: number;
  hommes: number;
  enfants: number;
  jeunes: number;
  total: number;
  created_at: string;
};

export async function getAdminBeneficiaires(filters: {
  q?: string;
  province?: string;
} = {}): Promise<BeneficiaireAgregat[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("beneficiaires_agregats" as never).select("*");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.ilike("province", `%${q}%`);
    }
    if (filters.province?.trim()) {
      query = query.eq("province", filters.province);
    }
    const { data, error } = await query.order("periode", { ascending: false });
    return error || !data ? [] : (data as BeneficiaireAgregat[]);
  } catch {
    return [];
  }
}
