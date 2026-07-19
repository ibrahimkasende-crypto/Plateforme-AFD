import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export async function appendAuditLog(
  supabase: SupabaseClient,
  input: {
    action: string;
    module: string;
    entityType?: string;
    entityId?: string;
    oldValues?: Record<string, unknown> | null;
    newValues?: Record<string, unknown> | null;
    reason?: string;
    result?: string;
    sensitivity?: string;
  },
) {
  try {
    await supabase.rpc("append_audit_log" as never, {
      p_action: input.action,
      p_module: input.module,
      p_entity_type: input.entityType ?? null,
      p_entity_id: input.entityId ?? null,
      p_old: input.oldValues ?? null,
      p_new: input.newValues ?? null,
      p_reason: input.reason ?? null,
      p_result: input.result ?? "success",
      p_sensitivity: input.sensitivity ?? "interne",
    } as never);
  } catch {
    // Ne jamais bloquer le métier si le journal échoue.
  }
}
