"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { appendAuditLog } from "@/features/identity/services/audit.service";

const schema = z.object({
  title: z.string().min(3),
  type: z.string().min(2),
  description: z.string().optional(),
  activity_date: z.string().optional(),
  province: z.string().optional(),
  location: z.string().optional(),
  programme_id: z.string().optional(),
  projet_id: z.string().optional(),
  femmes: z.coerce.number().int().min(0).optional(),
  hommes: z.coerce.number().int().min(0).optional(),
  enfants: z.coerce.number().int().min(0).optional(),
  jeunes: z.coerce.number().int().min(0).optional(),
  status: z.string().optional(),
});

async function syncBeneficiairesAgregat(
  supabase: NonNullable<Awaited<ReturnType<typeof createClientSafe>>>,
  payload: {
    activity_date: string | null;
    programme_id: string | null;
    projet_id: string | null;
    province: string | null;
    femmes: number;
    hommes: number;
    enfants: number;
    jeunes: number;
    total: number;
  },
) {
  if (!payload.activity_date) return;
  await supabase.from("beneficiaires_agregats" as never).insert({
    periode: payload.activity_date,
    programme_id: payload.programme_id,
    projet_id: payload.projet_id,
    province: payload.province,
    femmes: payload.femmes,
    hommes: payload.hommes,
    enfants: payload.enfants,
    jeunes: payload.jeunes,
    total: payload.total,
    is_demo: false,
    demo_batch_id: null,
  } as never);
}

export async function saveActivite(formData: FormData) {
  await requirePermission("activites:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const femmes = parsed.data.femmes ?? 0;
  const hommes = parsed.data.hommes ?? 0;
  const enfants = parsed.data.enfants ?? 0;
  const jeunes = parsed.data.jeunes ?? 0;
  const total = femmes + hommes + enfants + jeunes;
  const id = String(formData.get("id") || "");

  const payload = {
    title: parsed.data.title,
    type: parsed.data.type,
    description: parsed.data.description || null,
    activity_date: parsed.data.activity_date || null,
    province: parsed.data.province || null,
    location: parsed.data.location || null,
    programme_id: parsed.data.programme_id || null,
    projet_id: parsed.data.projet_id || null,
    femmes,
    hommes,
    enfants,
    jeunes,
    total,
    status: parsed.data.status || "planifiee",
    active: true,
    updated_at: new Date().toISOString(),
  };

  if (id && z.string().uuid().safeParse(id).success) {
    await supabase.from("activites" as never).update(payload as never).eq("id", id);
    await appendAuditLog(supabase, {
      action: "activites.update",
      module: "activites",
      entityType: "activites",
      entityId: id,
    });
    revalidatePath("/admin/activites");
    revalidatePath(`/admin/activites/${id}`);
    redirect(`/admin/activites/${id}`);
  }

  const { data, error } = await supabase
    .from("activites" as never)
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
    action: "activites.create",
    module: "activites",
    entityType: "activites",
    entityId: newId,
  });
  revalidatePath("/admin/activites");
  redirect(`/admin/activites/${newId}`);
}

export async function updateActiviteStatus(id: string, status: string) {
  await requirePermission("activites:write");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;

  const { data: current } = await supabase
    .from("activites" as never)
    .select(
      "id, activity_date, programme_id, projet_id, province, femmes, hommes, enfants, jeunes, total, status",
    )
    .eq("id", id)
    .maybeSingle();

  await supabase
    .from("activites" as never)
    .update({ status, updated_at: new Date().toISOString() } as never)
    .eq("id", id);

  if (
    status === "realisee" &&
    current &&
    (current as { status: string }).status !== "realisee"
  ) {
    const row = current as {
      activity_date: string | null;
      programme_id: string | null;
      projet_id: string | null;
      province: string | null;
      femmes: number;
      hommes: number;
      enfants: number;
      jeunes: number;
      total: number;
    };
    await syncBeneficiairesAgregat(supabase, row);
  }

  await appendAuditLog(supabase, {
    action: "activites.status",
    module: "activites",
    entityType: "activites",
    entityId: id,
    newValues: { status },
  });
  revalidatePath("/admin/activites");
  revalidatePath(`/admin/activites/${id}`);
  revalidatePath("/admin");
}
