"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({
  display_name: z.string().min(2),
  slug: z.string().optional(),
  role_or_profile: z.string().optional(),
  quote: z.string().min(10),
  province: z.string().optional(),
  image_url: z.string().optional(),
  consent_status: z.enum([
    "approved",
    "to-review",
    "not-required",
    "refused",
    "absent",
  ]),
  anonymized: z.string().optional(),
  active: z.string().optional(),
  publie: z.string().optional(),
  order_index: z.coerce.number().int().min(0).optional(),
});

function canPublish(consent: string, published: boolean): boolean {
  if (!published) return true;
  return consent === "approved" || consent === "not-required";
}

export async function saveTemoignage(formData: FormData) {
  await requirePermission("temoignages:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const publie = parsed.data.publie === "on";
  if (!canPublish(parsed.data.consent_status, publie)) {
    return;
  }

  const payload = {
    display_name: parsed.data.display_name,
    slug: parsed.data.slug || null,
    role_or_profile: parsed.data.role_or_profile || null,
    quote: parsed.data.quote,
    province: parsed.data.province || null,
    image_url: parsed.data.image_url || null,
    consent_status: parsed.data.consent_status,
    anonymized: parsed.data.anonymized === "on",
    active: parsed.data.active !== "off",
    publie,
    order_index: parsed.data.order_index ?? 0,
    published_at: publie ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("temoignages").update(payload).eq("id", id);
  } else {
    await supabase.from("temoignages").insert(payload);
  }

  revalidatePath("/admin/publications/temoignages");
  revalidatePath("/impact/temoignages");
  revalidatePath("/impact");
  redirect("/admin/publications/temoignages");
}

export async function softDeleteTemoignage(formData: FormData) {
  await requirePermission("temoignages:write");
  const id = String(formData.get("id") || "");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  await supabase
    .from("temoignages")
    .update({ deleted_at: new Date().toISOString(), publie: false, active: false })
    .eq("id", id);
  revalidatePath("/admin/publications/temoignages");
  revalidatePath("/impact/temoignages");
}
