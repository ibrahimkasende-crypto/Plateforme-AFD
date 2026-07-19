"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { createEmployee } from "@/features/hr/services/employees.service";

const schema = z.object({
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
});

export async function createEmployeeAction(formData: FormData): Promise<void> {
  await requirePermission("hr.manage_employees");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const id = await createEmployee(supabase, {
    nom: parsed.data.nom,
    postnom: parsed.data.postnom,
    prenom: parsed.data.prenom,
    email: parsed.data.email || undefined,
    telephone: parsed.data.telephone,
    matricule: parsed.data.matricule,
    departementId: parsed.data.departement_id || undefined,
    posteId: parsed.data.poste_id || undefined,
    dateEmbauche: parsed.data.date_embauche,
    typeContrat: parsed.data.type_contrat,
    province: parsed.data.province,
  });

  revalidatePath("/admin/rh/personnel");
  redirect(`/admin/rh/personnel/${id}`);
}
