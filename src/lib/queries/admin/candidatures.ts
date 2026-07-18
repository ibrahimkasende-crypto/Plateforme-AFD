import { createClientSafe } from "@/lib/supabase/safe";

export type AdminApplication = {
  id: string; prenom: string; nom: string; email: string; statut: string;
  est_spontanee: boolean; opportunite_id: string | null; created_at: string;
};

export async function getAdminApplications(): Promise<AdminApplication[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    const { data, error } = await supabase.from("candidatures").select("id, prenom, nom, email, statut, est_spontanee, opportunite_id, created_at").is("deleted_at", null).order("created_at", { ascending: false });
    return error || !data ? [] : data;
  } catch { return []; }
}
