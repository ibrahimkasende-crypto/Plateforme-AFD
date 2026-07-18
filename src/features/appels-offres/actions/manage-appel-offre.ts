"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({
  titre: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  resume: z.string().optional(),
  description: z.string().optional(),
  procedure: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal("")),
  localisation: z.string().optional(),
  date_limite: z.string().optional(),
  document_principal_path: z.string().optional(),
  statut: z.enum(["brouillon", "ouvert", "cloture", "suspendu", "archive"]),
  publie: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export async function saveAppelOffre(formData: FormData) {
  await requirePermission("appels-offres:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const publie = parsed.data.publie === "on";
  const statut = publie && parsed.data.statut === "brouillon" ? "ouvert" : parsed.data.statut;

  const payload = {
    titre: parsed.data.titre,
    slug: parsed.data.slug,
    resume: parsed.data.resume || null,
    description: parsed.data.description || null,
    procedure: parsed.data.procedure || null,
    contact_email: parsed.data.contact_email || null,
    localisation: parsed.data.localisation || null,
    date_limite: parsed.data.date_limite || null,
    document_principal_path: parsed.data.document_principal_path || null,
    statut,
    publie,
    seo_title: parsed.data.seo_title || null,
    seo_description: parsed.data.seo_description || null,
    date_publication: publie ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("appels_offres").update(payload).eq("id", id);
  } else {
    await supabase.from("appels_offres").insert(payload);
  }

  revalidatePath("/admin/publications/appels-offres");
  revalidatePath("/ressources/appels-offres");
  redirect("/admin/publications/appels-offres");
}

export async function softDeleteAppelOffre(formData: FormData) {
  await requirePermission("appels-offres:write");
  const id = String(formData.get("id") || "");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  await supabase
    .from("appels_offres")
    .update({ deleted_at: new Date().toISOString(), publie: false, statut: "archive" })
    .eq("id", id);
  revalidatePath("/admin/publications/appels-offres");
  revalidatePath("/ressources/appels-offres");
}

export async function closeAppelOffre(id: string) {
  await requirePermission("appels-offres:write");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  await supabase
    .from("appels_offres")
    .update({ statut: "cloture", updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/publications/appels-offres");
  revalidatePath("/ressources/appels-offres");
}
