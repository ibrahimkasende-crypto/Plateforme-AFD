"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const campagneSchema = z.object({
  title: z.string().min(3),
  subject: z.string().min(3),
  status: z.enum(["brouillon", "programmee", "envoyee"]).optional(),
  scheduled_at: z.string().optional(),
});

const modeleSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(1),
  active: z.string().optional(),
});

export async function saveCampagne(formData: FormData) {
  await requirePermission("newsletter:write");
  const parsed = campagneSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  await supabase.from("newsletter_campagnes" as never).insert({
    title: parsed.data.title,
    subject: parsed.data.subject,
    status: parsed.data.status || "brouillon",
    scheduled_at: parsed.data.scheduled_at || null,
    is_demo: false,
    demo_batch_id: null,
  } as never);

  revalidatePath("/admin/newsletter/campagnes");
  redirect("/admin/newsletter/campagnes");
}

export async function saveModele(formData: FormData) {
  await requirePermission("newsletter:write");
  const parsed = modeleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  await supabase.from("newsletter_modeles" as never).insert({
    title: parsed.data.title,
    body: parsed.data.body,
    active: parsed.data.active === "on",
    is_demo: false,
    demo_batch_id: null,
  } as never);

  revalidatePath("/admin/newsletter/modeles");
  redirect("/admin/newsletter/modeles");
}

export async function updateAbonneStatut(id: string, statut: string) {
  await requirePermission("newsletter:write");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase.from("abonnes_newsletter" as never).update({ statut, updated_at: new Date().toISOString() } as never).eq("id", id);
  revalidatePath("/admin/newsletter/abonnes");
}

export async function markCampagneSent(id: string) {
  await requirePermission("newsletter:send");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase
    .from("newsletter_campagnes" as never)
    .update({ status: "envoyee", sent_at: new Date().toISOString() } as never)
    .eq("id", id);
  revalidatePath("/admin/newsletter/campagnes");
}
