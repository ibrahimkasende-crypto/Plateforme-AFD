import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { appendAuditLog } from "@/features/identity/services/audit.service";

export async function enqueueBackgroundJob(
  supabase: SupabaseClient,
  input: {
    type: string;
    payload: Record<string, unknown>;
    createdBy: string;
    idempotencyKey?: string;
    priorite?: number;
  },
) {
  if (input.idempotencyKey) {
    const { data: existing } = await supabase
      .from("background_jobs" as never)
      .select("id")
      .eq("idempotency_key", input.idempotencyKey)
      .maybeSingle();
    if (existing && typeof existing === "object" && "id" in existing) {
      return String((existing as { id: string }).id);
    }
  }

  const { data, error } = await supabase
    .from("background_jobs" as never)
    .insert({
      type: input.type,
      payload: input.payload,
      statut: "queued",
      priorite: input.priorite ?? 100,
      idempotency_key: input.idempotencyKey ?? null,
      created_by: input.createdBy,
    } as never)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Échec enqueue job");
  }

  const id = String((data as { id: string }).id);
  await supabase.from("background_job_events" as never).insert({
    job_id: id,
    event_type: "queued",
    message: `Job ${input.type} mis en file`,
  } as never);

  await appendAuditLog(supabase, {
    action: "jobs.enqueue",
    module: "jobs",
    entityType: "background_jobs",
    entityId: id,
    newValues: { type: input.type },
  });

  return id;
}
