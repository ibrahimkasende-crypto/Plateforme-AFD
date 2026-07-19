"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { appendAuditLog } from "@/features/identity/services/audit.service";

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
  const id = String(formData.get("id") || "");

  const payload = {
    title: parsed.data.title,
    slug,
    summary: parsed.data.summary || null,
    province: parsed.data.province || null,
    started_at: parsed.data.started_at || null,
    ended_at: parsed.data.ended_at || null,
    status: parsed.data.status || "active",
    active: (parsed.data.status || "active") === "active",
    updated_at: new Date().toISOString(),
  };

  if (id && z.string().uuid().safeParse(id).success) {
    await supabase.from("urgences" as never).update(payload as never).eq("id", id);
    await appendAuditLog(supabase, {
      action: "urgences.update",
      module: "urgences",
      entityType: "urgences",
      entityId: id,
    });
    revalidatePath("/admin/urgences");
    revalidatePath(`/admin/urgences/${id}`);
    redirect(`/admin/urgences/${id}`);
  }

  const { data, error } = await supabase
    .from("urgences" as never)
    .insert({
      ...payload,
      is_demo: false,
      demo_batch_id: null,
    } as never)
    .select("id")
    .single();
  if (error || !data) return;
  const newId = String((data as { id: string }).id);
  await appendAuditLog(supabase, {
    action: "urgences.create",
    module: "urgences",
    entityType: "urgences",
    entityId: newId,
  });
  revalidatePath("/admin/urgences");
  redirect(`/admin/urgences/${newId}`);
}

export async function closeUrgence(id: string) {
  await requirePermission("urgences:write");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase
    .from("urgences" as never)
    .update({
      status: "closed",
      active: false,
      ended_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", id);
  await appendAuditLog(supabase, {
    action: "urgences.close",
    module: "urgences",
    entityType: "urgences",
    entityId: id,
  });
  revalidatePath("/admin/urgences");
  revalidatePath(`/admin/urgences/${id}`);
}

export async function addUrgenceSitrepAction(formData: FormData) {
  const session = await requirePermission("urgences:write");
  const parsed = z
    .object({
      urgence_id: z.string().uuid(),
      titre: z.string().min(2),
      contenu: z.string().min(2),
      population_affectee: z.coerce.number().int().optional(),
      besoins: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase.from("urgence_sitreps" as never).insert({
    urgence_id: parsed.data.urgence_id,
    titre: parsed.data.titre,
    contenu: parsed.data.contenu,
    population_affectee: parsed.data.population_affectee ?? null,
    besoins: parsed.data.besoins ?? null,
    created_by: session.user.id,
  } as never);
  revalidatePath(`/admin/urgences/${parsed.data.urgence_id}`);
}
