"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const clusterSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  type: z.string().optional(),
  icon: z.string().optional(),
  order: z.coerce.number().int().min(0).optional(),
  active: z.string().optional(),
});

export async function saveCluster(formData: FormData) {
  await requirePermission("clusters:write");
  const parsed = clusterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;
  const id = String(formData.get("id") || "");

  const payload = {
    name: parsed.data.name,
    description: parsed.data.description || null,
    type: parsed.data.type || null,
    icon: parsed.data.icon || null,
    order: parsed.data.order ?? 0,
    active: parsed.data.active === "on",
    is_demo: false,
    demo_batch_id: null,
  };

  if (id && z.string().uuid().safeParse(id).success) {
    await supabase.from("clusters" as never).update(payload as never).eq("id", id);
  } else {
    await supabase.from("clusters" as never).insert(payload as never);
  }

  revalidatePath("/admin/clusters");
  redirect("/admin/clusters");
}

export async function toggleClusterActive(id: string, active: boolean) {
  await requirePermission("clusters:write");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase.from("clusters" as never).update({ active } as never).eq("id", id);
  revalidatePath("/admin/clusters");
}

export async function addClusterMembreAction(formData: FormData) {
  await requirePermission("clusters:write");
  const parsed = z
    .object({
      cluster_id: z.string().uuid(),
      nom: z.string().min(2),
      role: z.string().optional(),
      email: z.string().email().optional().or(z.literal("")),
      organisation: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase.from("cluster_membres" as never).insert({
    cluster_id: parsed.data.cluster_id,
    nom: parsed.data.nom,
    role: parsed.data.role ?? null,
    email: parsed.data.email || null,
    organisation: parsed.data.organisation ?? null,
  } as never);
  revalidatePath("/admin/clusters");
  revalidatePath(`/admin/clusters/${parsed.data.cluster_id}`);
}

export async function addClusterReunionAction(formData: FormData) {
  await requirePermission("clusters:write");
  const parsed = z
    .object({
      cluster_id: z.string().uuid(),
      titre: z.string().min(2),
      date_reunion: z.string().optional(),
      decisions: z.string().optional(),
      actions: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase.from("cluster_reunions" as never).insert({
    cluster_id: parsed.data.cluster_id,
    titre: parsed.data.titre,
    date_reunion: parsed.data.date_reunion || new Date().toISOString().slice(0, 10),
    decisions: parsed.data.decisions ?? null,
    actions: parsed.data.actions ?? null,
  } as never);
  revalidatePath("/admin/clusters");
  revalidatePath(`/admin/clusters/${parsed.data.cluster_id}`);
}
