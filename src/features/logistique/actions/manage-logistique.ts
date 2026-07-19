"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { appendAuditLog } from "@/features/identity/services/audit.service";
import {
  archiveVehicule,
  type DemandeStatut,
  type MissionStatut,
  updateDemandeStatut,
  updateMissionStatut,
  updateVehicule,
} from "@/features/logistique/services/logistique.service";

function revalidateLogistique() {
  revalidatePath("/admin/logistique");
  revalidatePath("/admin/logistique/demandes");
  revalidatePath("/admin/logistique/vehicules");
  revalidatePath("/admin/logistique/missions");
}

export async function createLogistiqueDemandeAction(formData: FormData) {
  const session = await requirePermission("logistique:write");
  const parsed = z
    .object({
      titre: z.string().min(2),
      note: z.string().optional(),
      projet_id: z.string().uuid().optional().or(z.literal("")),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  const reference = `LOG-${Date.now().toString().slice(-8)}`;
  const { data, error } = await supabase
    .from("logistique_demandes" as never)
    .insert({
      reference,
      titre: parsed.data.titre,
      note: parsed.data.note ?? null,
      statut: "soumis",
      demandeur_id: session.user.id,
      projet_id: parsed.data.projet_id || null,
    } as never)
    .select("id")
    .single();
  if (error || !data) return;
  await appendAuditLog(supabase, {
    action: "logistique.demande.create",
    module: "logistique",
    entityType: "logistique_demandes",
    entityId: String((data as { id: string }).id),
  });
  revalidateLogistique();
}

export async function transitionDemandeStatutAction(formData: FormData) {
  const session = await requirePermission("logistique:write");
  const parsed = z
    .object({
      id: z.string().uuid(),
      statut: z.enum([
        "brouillon",
        "soumis",
        "approuve",
        "rejete",
        "commande",
        "recu",
        "annule",
      ]),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  try {
    await updateDemandeStatut(
      supabase,
      parsed.data.id,
      parsed.data.statut as DemandeStatut,
      session.user.id,
    );
  } catch {
    return;
  }
  revalidateLogistique();
}

export async function createVehiculeAction(formData: FormData) {
  await requirePermission("logistique:write");
  const parsed = z
    .object({
      immatriculation: z.string().min(2),
      type: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase.from("logistique_vehicules" as never).insert({
    immatriculation: parsed.data.immatriculation.toUpperCase(),
    type: parsed.data.type || "autre",
    statut: "disponible",
  } as never);
  revalidateLogistique();
}

export async function updateVehiculeAction(formData: FormData) {
  await requirePermission("logistique:write");
  const parsed = z
    .object({
      id: z.string().uuid(),
      statut: z.string().optional(),
      kilometrage: z.coerce.number().optional(),
      type: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await updateVehicule(supabase, parsed.data.id, {
    statut: parsed.data.statut,
    kilometrage: parsed.data.kilometrage,
    type: parsed.data.type,
  });
  revalidateLogistique();
}

export async function archiveVehiculeAction(formData: FormData) {
  await requirePermission("logistique:write");
  const id = String(formData.get("id") || "");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await archiveVehicule(supabase, id);
  revalidateLogistique();
}

export async function createMissionAction(formData: FormData) {
  await requirePermission("logistique:write");
  const parsed = z
    .object({
      titre: z.string().min(2),
      vehicule_id: z.string().uuid().optional().or(z.literal("")),
      province: z.string().optional(),
      date_debut: z.string().optional(),
      date_fin: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  const reference = `MIS-${Date.now().toString().slice(-8)}`;
  await supabase.from("logistique_missions" as never).insert({
    reference,
    titre: parsed.data.titre,
    vehicule_id: parsed.data.vehicule_id || null,
    province: parsed.data.province || null,
    date_debut: parsed.data.date_debut || null,
    date_fin: parsed.data.date_fin || null,
    statut: "planifiee",
  } as never);
  revalidateLogistique();
}

export async function transitionMissionStatutAction(formData: FormData) {
  await requirePermission("logistique:write");
  const parsed = z
    .object({
      id: z.string().uuid(),
      statut: z.enum(["planifiee", "en_cours", "terminee", "annulee"]),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  try {
    await updateMissionStatut(supabase, parsed.data.id, parsed.data.statut as MissionStatut);
  } catch {
    return;
  }
  revalidateLogistique();
}
