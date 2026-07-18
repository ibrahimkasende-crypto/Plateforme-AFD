"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({
  titre: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  statut: z.enum(["brouillon", "publiee", "cloturee", "archivee"]),
  visibilite: z.enum(["publique", "privee", "agents"]),
  province: z.string().optional(),
  date_ouverture: z.string().optional(),
  date_cloture: z.string().optional(),
  consentement_requis: z.string().optional(),
});

export async function saveEnquete(formData: FormData) {
  await requirePermission("enquetes:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const payload = {
    titre: parsed.data.titre,
    slug: parsed.data.slug,
    description: parsed.data.description || null,
    statut: parsed.data.statut,
    visibilite: parsed.data.visibilite,
    province: parsed.data.province || null,
    date_ouverture: parsed.data.date_ouverture || null,
    date_cloture: parsed.data.date_cloture || null,
    consentement_requis: parsed.data.consentement_requis === "on",
    updated_at: new Date().toISOString(),
  };

  if (id) await supabase.from("enquetes").update(payload).eq("id", id);
  else await supabase.from("enquetes").insert(payload);

  revalidatePath("/admin/enquetes");
  if (parsed.data.visibilite === "publique" && parsed.data.statut === "publiee") {
    revalidatePath(`/enquetes/${parsed.data.slug}`);
  }
  redirect("/admin/enquetes");
}

const questionSchema = z.object({
  enquete_id: z.string().uuid(),
  type_question: z.string().min(2),
  libelle: z.string().min(2),
  aide: z.string().optional(),
  obligatoire: z.string().optional(),
  ordre: z.coerce.number().int().min(0).default(0),
});

export async function saveQuestion(formData: FormData) {
  await requirePermission("enquetes:write");
  const parsed = questionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;

  await supabase.from("questions_enquete").insert({
    enquete_id: parsed.data.enquete_id,
    type_question: parsed.data.type_question,
    libelle: parsed.data.libelle,
    aide: parsed.data.aide || null,
    obligatoire: parsed.data.obligatoire === "on",
    ordre: parsed.data.ordre,
    configuration: {},
  });

  revalidatePath(`/admin/enquetes/${parsed.data.enquete_id}`);
  revalidatePath(`/admin/enquetes/${parsed.data.enquete_id}/modifier`);
}

export async function softDeleteEnquete(formData: FormData) {
  await requirePermission("enquetes:write");
  const id = String(formData.get("id") || "");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  await supabase
    .from("enquetes")
    .update({
      deleted_at: new Date().toISOString(),
      statut: "archivee",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  revalidatePath("/admin/enquetes");
}
