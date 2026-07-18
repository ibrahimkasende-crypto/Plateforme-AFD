import { createClientSafe } from "@/lib/supabase/safe";

export type PartenariatDemande = {
  id: string;
  organization_name: string;
  contact_email: string;
  message: string;
  status: string;
  created_at: string;
};

export async function getAdminPartenariats(filters: {
  q?: string;
  status?: string;
} = {}): Promise<PartenariatDemande[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    let query = supabase.from("partenariats_demandes" as never).select("*");
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`organization_name.ilike.%${q}%,contact_email.ilike.%${q}%`);
    }
    if (filters.status?.trim()) {
      query = query.eq("status", filters.status);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    return error || !data ? [] : (data as PartenariatDemande[]);
  } catch {
    return [];
  }
}
