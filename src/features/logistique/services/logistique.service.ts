import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { appendAuditLog } from "@/features/identity/services/audit.service";
import {
  canTransitionDemande,
  canTransitionMission,
  type DemandeStatut,
  type MissionStatut,
} from "@/features/logistique/lib/transitions";

export type { DemandeStatut, MissionStatut };
export { canTransitionDemande, canTransitionMission };

export async function listDemandes(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("logistique_demandes" as never)
    .select("id, reference, titre, statut, note, created_at, projet_id")
    .order("created_at", { ascending: false })
    .limit(100);
  return (data ?? []) as Array<{
    id: string;
    reference: string;
    titre: string;
    statut: string;
    note: string | null;
    created_at: string;
    projet_id: string | null;
  }>;
}

export async function updateDemandeStatut(
  supabase: SupabaseClient,
  id: string,
  to: DemandeStatut,
  userId: string,
) {
  const { data: current, error: readError } = await supabase
    .from("logistique_demandes" as never)
    .select("id, statut")
    .eq("id", id)
    .maybeSingle();
  if (readError || !current) throw new Error("Demande introuvable");
  const from = (current as { statut: DemandeStatut }).statut;
  if (!canTransitionDemande(from, to)) {
    throw new Error(`Transition invalide : ${from} → ${to}`);
  }
  const { error } = await supabase
    .from("logistique_demandes" as never)
    .update({ statut: to, updated_at: new Date().toISOString() } as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
  await appendAuditLog(supabase, {
    action: "logistique.demande.statut",
    module: "logistique",
    entityType: "logistique_demandes",
    entityId: id,
    oldValues: { statut: from },
    newValues: { statut: to, by: userId },
  });
}

export async function updateVehicule(
  supabase: SupabaseClient,
  id: string,
  input: { statut?: string; kilometrage?: number; type?: string },
) {
  const { error } = await supabase
    .from("logistique_vehicules" as never)
    .update({
      statut: input.statut,
      kilometrage: input.kilometrage,
      type: input.type,
    } as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function archiveVehicule(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from("logistique_vehicules" as never)
    .update({ actif: false } as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateMissionStatut(
  supabase: SupabaseClient,
  id: string,
  to: MissionStatut,
) {
  const { data: current, error: readError } = await supabase
    .from("logistique_missions" as never)
    .select("id, statut")
    .eq("id", id)
    .maybeSingle();
  if (readError || !current) throw new Error("Mission introuvable");
  const from = (current as { statut: MissionStatut }).statut;
  if (!canTransitionMission(from, to)) {
    throw new Error(`Transition invalide : ${from} → ${to}`);
  }
  const { error } = await supabase
    .from("logistique_missions" as never)
    .update({ statut: to } as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
  await appendAuditLog(supabase, {
    action: "logistique.mission.statut",
    module: "logistique",
    entityType: "logistique_missions",
    entityId: id,
    oldValues: { statut: from },
    newValues: { statut: to },
  });
}
