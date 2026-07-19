import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { appendAuditLog } from "@/features/identity/services/audit.service";

export type CreateEmployeeInput = {
  matricule?: string;
  nom: string;
  postnom?: string;
  prenom: string;
  email?: string;
  telephone?: string;
  departementId?: string;
  posteId?: string;
  dateEmbauche?: string;
  typeContrat?: string;
  province?: string;
  isDemo?: boolean;
  demoBatchId?: string;
};

export async function createEmployee(
  supabase: SupabaseClient,
  input: CreateEmployeeInput,
) {
  const nomAffichage = [input.prenom, input.nom, input.postnom]
    .filter(Boolean)
    .join(" ");

  const { data, error } = await supabase
    .from("hr_employes" as never)
    .insert({
      matricule: input.matricule || `AFD-${Date.now().toString().slice(-6)}`,
      nom: input.nom,
      postnom: input.postnom ?? null,
      prenom: input.prenom,
      nom_affichage: nomAffichage,
      email: input.email ?? null,
      telephone: input.telephone ?? null,
      departement_id: input.departementId || null,
      poste_id: input.posteId || null,
      date_embauche: input.dateEmbauche || null,
      type_contrat: input.typeContrat || "cdd",
      province: input.province || null,
      statut: "actif",
      is_demo: input.isDemo ?? false,
      demo_batch_id: input.demoBatchId ?? null,
    } as never)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Échec création employé");
  }

  const id = String((data as { id: string }).id);
  await appendAuditLog(supabase, {
    action: "hr.employee.create",
    module: "hr",
    entityType: "hr_employes",
    entityId: id,
    newValues: { nomAffichage, matricule: input.matricule },
  });
  return id;
}

export async function listEmployees(supabase: SupabaseClient, q?: string) {
  let query = supabase
    .from("hr_employes" as never)
    .select(
      "id, matricule, nom, postnom, prenom, nom_affichage, email, telephone, statut, date_embauche, departement_id, poste_id, province, is_demo",
    )
    .is("archived_at", null)
    .order("nom_affichage", { ascending: true })
    .limit(200);

  if (q?.trim()) {
    query = query.or(
      `nom_affichage.ilike.%${q}%,matricule.ilike.%${q}%,email.ilike.%${q}%`,
    );
  }

  const { data } = await query;
  return (data ?? []) as Array<Record<string, unknown>>;
}

export async function getHrDashboardStats(supabase: SupabaseClient) {
  const { data: employes } = await supabase
    .from("hr_employes" as never)
    .select("id, statut, genre, date_embauche, departement_id")
    .is("archived_at", null);

  const list = (employes ?? []) as Array<{
    id: string;
    statut: string;
    genre: string | null;
    date_embauche: string | null;
    departement_id: string | null;
  }>;

  const actifs = list.filter((e) => e.statut === "actif" || e.statut === "essai");
  const { count: conges } = await supabase
    .from("hr_conges" as never)
    .select("id", { count: "exact", head: true })
    .in("statut", ["demande", "approuve_n1", "approuve_rh"]);

  const { count: contratsExpirant } = await supabase
    .from("hr_contrats" as never)
    .select("id", { count: "exact", head: true })
    .eq("statut", "actif")
    .lt(
      "date_fin",
      new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    );

  return {
    actifs: actifs.length,
    femmes: list.filter((e) => e.genre === "F").length,
    hommes: list.filter((e) => e.genre === "M").length,
    congesOuverts: conges ?? 0,
    contratsExpirant: contratsExpirant ?? 0,
    total: list.length,
  };
}
