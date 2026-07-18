"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const schema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  summary: z.string().optional(),
  province: z.string().optional(),
  started_at: z.string().optional(),
  ended_at: z.string().optional(),
  status: z.enum(["active", "closed"]).optional(),
});

export async function saveUrgence(formData: FormData) {
  await requirePermission("urgences:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const slug = parsed.data.slug?.trim() || slugify(parsed.data.title);

  await supabase.from("urgences" as never).insert({
    title: parsed.data.title,
    slug,
    summary: parsed.data.summary || null,
    province: parsed.data.province || null,
    started_at: parsed.data.started_at || null,
    ended_at: parsed.data.ended_at || null,
    status: parsed.data.status || "active",
    active: true,
    is_demo: false,
    demo_batch_id: null,
    updated_at: new Date().toISOString(),
  } as never);

  revalidatePath("/admin/urgences");
  redirect("/admin/urgences");
}

export async function closeUrgence(id: string) {
  await requirePermission("urgences:write");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase
    .from("urgences" as never)
    .update({ status: "closed", active: false, updated_at: new Date().toISOString() } as never)
    .eq("id", id);
  revalidatePath("/admin/urgences");
}
