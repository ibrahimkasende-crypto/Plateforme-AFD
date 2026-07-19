import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { appendAuditLog } from "@/features/identity/services/audit.service";

export async function createApprovalRequest(
  supabase: SupabaseClient,
  input: {
    module: string;
    entityType: string;
    entityId: string;
    workflowCode: string;
    requestedBy: string;
    reason?: string;
  },
) {
  const { data, error } = await supabase
    .from("approval_requests" as never)
    .insert({
      module: input.module,
      entity_type: input.entityType,
      entity_id: input.entityId,
      workflow_code: input.workflowCode,
      current_state: "brouillon",
      requested_by: input.requestedBy,
      reason: input.reason ?? null,
    } as never)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Échec création demande d’approbation");
  }

  const id = String((data as { id: string }).id);
  await appendAuditLog(supabase, {
    action: "workflow.request.create",
    module: input.module,
    entityType: "approval_requests",
    entityId: id,
  });
  return id;
}

export async function transitionApproval(
  supabase: SupabaseClient,
  input: {
    requestId: string;
    actorId: string;
    actionCode: string;
    toState: string;
    comment?: string;
  },
) {
  const { data: request } = await supabase
    .from("approval_requests" as never)
    .select("id, current_state, workflow_code, module")
    .eq("id", input.requestId)
    .single();

  if (!request) throw new Error("Demande introuvable");
  const current = request as {
    id: string;
    current_state: string;
    workflow_code: string;
    module: string;
  };

  const { data: wf } = await supabase
    .from("workflow_definitions" as never)
    .select("id")
    .eq("code", current.workflow_code)
    .maybeSingle();

  if (!wf) throw new Error("Workflow introuvable");

  const { data: transition } = await supabase
    .from("workflow_transitions" as never)
    .select("id")
    .eq("workflow_id", (wf as { id: string }).id)
    .eq("from_state", current.current_state)
    .eq("to_state", input.toState)
    .eq("action_code", input.actionCode)
    .maybeSingle();

  if (!transition) {
    throw new Error(
      `Transition invalide : ${current.current_state} → ${input.toState} (${input.actionCode})`,
    );
  }

  await supabase
    .from("approval_requests" as never)
    .update({
      current_state: input.toState,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", input.requestId);

  await supabase.from("approval_decisions" as never).insert({
    request_id: input.requestId,
    actor_id: input.actorId,
    from_state: current.current_state,
    to_state: input.toState,
    action_code: input.actionCode,
    comment: input.comment ?? null,
  } as never);

  await supabase.from("workflow_history" as never).insert({
    request_id: input.requestId,
    from_state: current.current_state,
    to_state: input.toState,
    actor_id: input.actorId,
    action_code: input.actionCode,
    comment: input.comment ?? null,
  } as never);

  await appendAuditLog(supabase, {
    action: `workflow.${input.actionCode}`,
    module: current.module,
    entityType: "approval_requests",
    entityId: input.requestId,
    oldValues: { state: current.current_state },
    newValues: { state: input.toState },
  });
}
