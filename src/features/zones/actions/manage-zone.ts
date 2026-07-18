"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({
  province: z.string().min(2),
  main_locality: z.string().optional(),
  svg_id: z.string().optional(),
  color: z.string().optional(),
  summary: z.string().optional(),
  image_url: z.string().optional(),
  projects_count: z.coerce.number().int().nonnegative().optional(),
  activities_count: z.coerce.number().int().nonnegative().optional(),
  beneficiaries_count: z.coerce.number().int().nonnegative().optional(),
  sectors: z.string().optional(),
  status: z.enum(["brouillon", "publie", "archive"]),
  active: z.string().optional(),
  is_demo: z.string().optional(),
});

export async function saveZone(formData: FormData) {
  await requirePermission("programmes:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const sectors = (parsed.data.sectors ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const payload = {
    province: parsed.data.province,
    main_locality: parsed.data.main_locality || null,
    svg_id: parsed.data.svg_id || null,
    color: parsed.data.color || null,
    summary: parsed.data.summary || null,
    image_url: parsed.data.image_url || null,
    projects_count: parsed.data.projects_count ?? null,
    activities_count: parsed.data.activities_count ?? null,
    beneficiaries_count: parsed.data.beneficiaries_count ?? null,
    sectors,
    status: parsed.data.status,
    active: parsed.data.active !== "off",
    is_demo: parsed.data.is_demo === "on",
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("zones_intervention" as never).update(payload as never).eq("id", id);
  } else {
    await supabase.from("zones_intervention" as never).insert(payload as never);
  }

  revalidatePath("/admin/zones-intervention");
  redirect("/admin/zones-intervention");
}

export async function archiveZone(id: string) {
  await requirePermission("programmes:write");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  await supabase
    .from("zones_intervention" as never)
    .update({ status: "archive", active: false, updated_at: new Date().toISOString() } as never)
    .eq("id", id);
  revalidatePath("/admin/zones-intervention");
}
