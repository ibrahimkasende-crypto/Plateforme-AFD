"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  long_description: z.string().min(10),
  icon: z.string().optional(),
  color: z.string().optional(),
  order: z.coerce.number().int().min(0).optional(),
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

export async function saveProgramme(formData: FormData) {
  await requirePermission("programmes:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const slug =
    parsed.data.slug && parsed.data.slug.length > 0
      ? parsed.data.slug
      : slugify(parsed.data.title);

  const payload = {
    title: parsed.data.title,
    slug,
    description: parsed.data.description,
    long_description: parsed.data.long_description,
    icon: parsed.data.icon || "heart",
    color: parsed.data.color || "sky",
    order: parsed.data.order ?? 0,
    image_url: parsed.data.image_url || null,
    active: parsed.data.active === "on",
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("programmes").update(payload).eq("id", id);
  } else {
    await supabase.from("programmes").insert(payload);
  }

  revalidatePath("/admin/programmes");
  redirect("/admin/programmes");
}

export async function archiveProgramme(id: string) {
  await requirePermission("programmes:write");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  await supabase
    .from("programmes")
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/programmes");
}

export async function restoreProgramme(id: string) {
  await requirePermission("programmes:write");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  await supabase
    .from("programmes")
    .update({ active: true, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/programmes");
}
