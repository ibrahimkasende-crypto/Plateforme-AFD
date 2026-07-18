import { createClientSafe } from "@/lib/supabase/safe";

export type AgentTerrain = {
  id: string;
  user_id: string | null;
  matricule: string | null;
  full_name: string;
  fonction: string | null;
  telephone: string | null;
  province: string | null;
  territoire: string | null;
  programme_id: string | null;
  projet_id: string | null;
  superviseur_id: string | null;
  actif: boolean;
  disponibilite: string | null;
  date_affectation: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export async function getAdminAgents(): Promise<AgentTerrain[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("agents_terrain")
      .select("*")
      .is("deleted_at", null)
      .order("full_name", { ascending: true });
    return error || !data ? [] : (data as AgentTerrain[]);
  } catch {
    return [];
  }
}

export async function getAdminAgent(id: string): Promise<AgentTerrain | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("agents_terrain")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return error || !data ? null : (data as AgentTerrain);
  } catch {
    return null;
  }
}
