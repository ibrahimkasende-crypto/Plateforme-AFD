"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { appendAuditLog } from "@/features/identity/services/audit.service";

const schema = z.object({
  id: z.string().uuid(),
  nom: z.string().min(1),
  postnom: z.string().optional(),
  prenom: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  telephone: z.string().optional(),
  matricule: z.string().optional(),
  departement_id: z.string().uuid().optional().or(z.literal("")),
  poste_id: z.string().uuid().optional().or(z.literal("")),
  date_embauche: z.string().optional(),
  type_contrat: z.string().optional(),
  province: z.string().optional(),
  statut: z.string().optional(),
  genre: z.string().optional(),
});

export async function updateEmployeeAction(formData: FormData): Promise<void> {
  await requirePermission("hr.manage_employees");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const nomAffichage = [parsed.data.prenom, parsed.data.nom, parsed.data.postnom]
    .filter(Boolean)
    .join(" ");

  const { error } = await supabase
    .from("hr_employes" as never)
    .update({
      nom: parsed.data.nom,
      postnom: parsed.data.postnom ?? null,
      prenom: parsed.data.prenom,
      nom_affichage: nomAffichage,
      email: parsed.data.email || null,
      telephone: parsed.data.telephone ?? null,
      matricule: parsed.data.matricule ?? null,
      departement_id: parsed.data.departement_id || null,
      poste_id: parsed.data.poste_id || null,
      date_embauche: parsed.data.date_embauche || null,
      type_contrat: parsed.data.type_contrat ?? null,
      province: parsed.data.province ?? null,
      statut: parsed.data.statut ?? "actif",
      genre: parsed.data.genre || null,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", parsed.data.id);

  if (error) return;

  await appendAuditLog(supabase, {
    action: "hr.employee.update",
    module: "hr",
    entityType: "hr_employes",
    entityId: parsed.data.id,
    newValues: { nomAffichage },
  });

  revalidatePath("/admin/rh/personnel");
  revalidatePath(`/admin/rh/personnel/${parsed.data.id}`);
  redirect(`/admin/rh/personnel/${parsed.data.id}`);
}
