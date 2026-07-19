"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { appendAuditLog } from "@/features/identity/services/audit.service";

export async function createLogistiqueDemandeAction(formData: FormData) {
  const session = await requirePermission("logistique:write");
  const parsed = z
    .object({
      titre: z.string().min(2),
      note: z.string().optional(),
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
  revalidatePath("/admin/logistique");
  revalidatePath("/admin/logistique/demandes");
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
  revalidatePath("/admin/logistique");
  revalidatePath("/admin/logistique/vehicules");
}

export async function createMissionAction(formData: FormData) {
  await requirePermission("logistique:write");
  const parsed = z
    .object({
      titre: z.string().min(2),
      vehicule_id: z.string().uuid().optional(),
      province: z.string().optional(),
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
    statut: "planifiee",
  } as never);
  revalidatePath("/admin/logistique");
  revalidatePath("/admin/logistique/missions");
}
