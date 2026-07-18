"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/).optional().or(z.literal("")),
  description: z.string().min(10),
  location: z.string().min(2),
  program_id: z.string().uuid().optional().or(z.literal("")),
  status: z.enum(["en_cours", "termine", "futur"]),
  start_date: z.string().min(4),
  end_date: z.string().optional(),
  budget: z.coerce.number().nonnegative().optional(),
  beneficiaries: z.coerce.number().int().nonnegative().optional(),
  results: z.string().optional(),
  image_url: z.string().optional(),
  active: z.string().optional(),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function saveProjet(formData: FormData) {
  await requirePermission("projets:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const slugInput = String(formData.get("slug") || "");
  const slug = slugInput.length > 0 ? slugInput : slugify(parsed.data.title);

  const payload = {
    title: parsed.data.title,
    slug,
    description: parsed.data.description,
    location: parsed.data.location,
    program_id: parsed.data.program_id || null,
    status: parsed.data.status,
    start_date: parsed.data.start_date,
    end_date: parsed.data.end_date || null,
    budget: parsed.data.budget ?? null,
    beneficiaries: parsed.data.beneficiaries ?? null,
    results: parsed.data.results || null,
    image_url: parsed.data.image_url || null,
    active: parsed.data.active === "on",
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("projets").update(payload).eq("id", id);
  } else {
    await supabase.from("projets").insert(payload);
  }

  revalidatePath("/admin/projets");
  redirect("/admin/projets");
}

export async function archiveProjet(id: string) {
  await requirePermission("projets:write");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  await supabase
    .from("projets")
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/projets");
}

export async function restoreProjet(id: string) {
  await requirePermission("projets:write");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  await supabase
    .from("projets")
    .update({ active: true, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/projets");
}
