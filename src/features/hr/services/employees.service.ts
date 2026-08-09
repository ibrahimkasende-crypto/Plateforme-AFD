import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";
import { appendAuditLog } from "@/features/identity/services/audit.service";

export type CreateEmployeeInput = {
  matricule?: string;
  nom: string;
  postnom?: string;
  prenom: string;
  deuxiemePrenom?: string;
  email?: string;
  emailPersonnel?: string;
  telephone?: string;
  telephoneSecondaire?: string;
  sexe?: string;
  dateNaissance?: string;
  adresse?: string;
  commune?: string;
  ville?: string;
  province?: string;
  pays?: string;
  departementId?: string;
  posteId?: string;
  service?: string;
  fonction?: string;
  dateEmbauche?: string;
  dateFin?: string;
  typeContrat?: string;
  typeAgent?: string;
  bureau?: string;
  provinceAffectation?: string;
  territoireAffectation?: string;
  statut?: string;
  isDemo?: boolean;
  demoBatchId?: string;
};

const HR_BUCKET = "hr-private";

export async function createEmployee(
  supabase: SupabaseClient,
  input: CreateEmployeeInput,
) {
  const nomAffichage = [
    input.prenom,
    input.deuxiemePrenom,
    input.nom,
    input.postnom,
  ]
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
      genre: input.sexe || null,
      date_naissance: input.dateNaissance || null,
      adresse: input.adresse ?? null,
      province: input.province || null,
      departement_id: input.departementId || null,
      poste_id: input.posteId || null,
      date_embauche: input.dateEmbauche || null,
      type_contrat: input.typeContrat || "cdd",
      categorie_pro: input.typeAgent || null,
      statut: input.statut || "actif",
      is_demo: input.isDemo ?? false,
      demo_batch_id: input.demoBatchId ?? null,
    } as never)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Échec création employé");
  }

  const id = String((data as { id: string }).id);

  // Champs étendus (migration 20260804_050) — best effort
  await supabase
    .from("hr_employes" as never)
    .update({
      deuxieme_prenom: input.deuxiemePrenom ?? null,
      email_personnel: input.emailPersonnel ?? null,
      telephone_secondaire: input.telephoneSecondaire ?? null,
      commune: input.commune ?? null,
      ville: input.ville ?? null,
      pays: input.pays || "RD Congo",
      service: input.service ?? null,
      fonction: input.fonction ?? null,
      date_fin: input.dateFin || null,
      bureau: input.bureau ?? null,
      province_affectation: input.provinceAffectation ?? null,
      territoire_affectation: input.territoireAffectation ?? null,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", id);
  await appendAuditLog(supabase, {
    action: "hr.employee.create",
    module: "hr",
    entityType: "hr_employes",
    entityId: id,
    newValues: { nomAffichage, matricule: input.matricule },
  });
  return id;
}

export async function uploadEmployeePhoto(
  employeeId: string,
  file: File,
): Promise<{ bucket: string; path: string } | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Photo trop volumineuse (max 5 Mo).");
  }
  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
  if (!allowed.has(file.type)) {
    throw new Error("Format photo non supporté.");
  }

  const service = createAdminServiceClient();
  if (!service) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY manquante pour l’upload photo.");
  }

  const ext =
    file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `employees/${employeeId}/profile.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await service.storage.from(HR_BUCKET).remove([path]).catch(() => undefined);
  const { error } = await service.storage.from(HR_BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: true,
    cacheControl: "3600",
  });
  if (error) throw new Error(error.message || "Échec upload photo employé.");

  await service
    .from("hr_employes" as never)
    .update({
      avatar_bucket: HR_BUCKET,
      avatar_path: path,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", employeeId);

  return { bucket: HR_BUCKET, path };
}

export async function linkEmployeeToUser(
  supabase: SupabaseClient,
  employeeId: string,
  userId: string,
) {
  const service = createAdminServiceClient() ?? supabase;
  await service
    .from("hr_employes" as never)
    .update({
      user_id: userId,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", employeeId);

  await service
    .from("profils_administrateurs" as never)
    .update({
      employe_id: employeeId,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", userId);
}

export async function listEmployees(supabase: SupabaseClient, q?: string) {
  let query = supabase
    .from("hr_employes" as never)
    .select(
      "id, matricule, nom, postnom, prenom, nom_affichage, email, telephone, statut, date_embauche, departement_id, poste_id, province, is_demo, avatar_bucket, avatar_path",
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

export async function getEmployeePhotoSignedUrl(
  bucket: string | null | undefined,
  path: string | null | undefined,
): Promise<string | null> {
  if (!bucket || !path) return null;
  const service = createAdminServiceClient();
  if (!service) return null;
  const { data } = await service.storage
    .from(bucket)
    .createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
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
