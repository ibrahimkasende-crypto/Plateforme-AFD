import { createClientSafe } from "@/lib/supabase/safe";

export type AdminApplication = {
  id: string; prenom: string; nom: string; email: string; statut: string;
  est_spontanee: boolean; opportunite_id: string | null; created_at: string;
  updated_at: string; note_interne: string | null; cv_storage_path: string | null;
};

export async function getAdminApplications(): Promise<AdminApplication[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    const { data, error } = await supabase.from("candidatures").select("id, prenom, nom, email, statut, est_spontanee, opportunite_id, created_at, updated_at, note_interne, cv_storage_path").is("deleted_at", null).order("created_at", { ascending: false });
    return error || !data ? [] : data;
  } catch { return []; }
}
