"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

/**
 * Réception d'une réponse hors-ligne avec clé d'idempotence.
 * Ne crée pas de doublon si la même clé est rejouée.
 */
export async function syncOfflineSurveyResponseAction(input: {
  enqueteId: string;
  idempotencyKey: string;
  payload: Record<string, unknown>;
  deviceId?: string;
}): Promise<{ ok: true; status: "synced" | "duplicate" } | { ok: false; error: string }> {
  await requirePermission("enquetes:write");
  const parsed = z
    .object({
      enqueteId: z.string().uuid(),
      idempotencyKey: z.string().min(8).max(120),
      payload: z.record(z.string(), z.unknown()),
      deviceId: z.string().optional(),
    })
    .safeParse(input);
  if (!parsed.success) return { ok: false, error: "Payload invalide" };

  const supabase = await createClientSafe();
  if (!supabase) return { ok: false, error: "Supabase indisponible" };

  const { data: existing } = await supabase
    .from("enquete_sync_queue" as never)
    .select("id, statut")
    .eq("idempotency_key", parsed.data.idempotencyKey)
    .maybeSingle();

  if (existing) {
    return { ok: true, status: "duplicate" };
  }

  const { error } = await supabase.from("enquete_sync_queue" as never).insert({
    enquete_id: parsed.data.enqueteId,
    idempotency_key: parsed.data.idempotencyKey,
    payload: parsed.data.payload,
    device_id: parsed.data.deviceId ?? null,
    statut: "synced",
    synced_at: new Date().toISOString(),
  } as never);

  if (error) return { ok: false, error: error.message };
  revalidatePath(`/admin/enquetes/${parsed.data.enqueteId}`);
  return { ok: true, status: "synced" };
}
