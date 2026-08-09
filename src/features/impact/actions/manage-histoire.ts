"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  person_or_community: z.string().optional(),
  location: z.string().optional(),
  quote: z.string().optional(),
  results: z.string().optional(),
  image_url: z.string().optional(),
  consent_status: z.enum([
    "approved",
    "to-review",
    "not-required",
    "refused",
    "absent",
  ]),
  status: z.enum([
    "brouillon",
    "en_revision",
    "approuve",
    "programme",
    "publie",
    "depublie",
    "archive",
  ]),
  anonymized: z.string().optional(),
  published: z.string().optional(),
  featured: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

function canPublish(consent: string, published: boolean): boolean {
  if (!published) return true;
  return consent === "approved" || consent === "not-required";
}

export async function saveHistoire(formData: FormData) {
  await requirePermission("histoires:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const published = parsed.data.published === "on";
  if (!canPublish(parsed.data.consent_status, published)) {
    return;
  }

  const payload = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt || null,
    content: parsed.data.content || null,
    person_or_community: parsed.data.person_or_community || null,
    location: parsed.data.location || null,
    quote: parsed.data.quote || null,
    results: parsed.data.results || null,
    image_url: parsed.data.image_url || null,
    consent_status: parsed.data.consent_status,
    status: published ? "publie" : parsed.data.status,
    anonymized: parsed.data.anonymized === "on",
    published,
    featured: parsed.data.featured === "on",
    seo_title: parsed.data.seo_title || null,
    seo_description: parsed.data.seo_description || null,
    published_at: published ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("histoires_impact").update(payload).eq("id", id);
  } else {
    await supabase.from("histoires_impact").insert(payload);
  }

  revalidatePath("/admin/publications/histoires-impact");
  revalidatePath("/impact/histoires");
  revalidatePath("/impact");
  revalidatePath("/");
  redirect("/admin/publications/histoires-impact");
}

export async function softDeleteHistoire(formData: FormData) {
  await requirePermission("histoires:write");
  const id = String(formData.get("id") || "");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  await supabase
    .from("histoires_impact")
    .update({ deleted_at: new Date().toISOString(), published: false, status: "archive" })
    .eq("id", id);
  revalidatePath("/admin/publications/histoires-impact");
  revalidatePath("/impact/histoires");
}
