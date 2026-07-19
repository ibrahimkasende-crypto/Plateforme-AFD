"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { appendAuditLog } from "@/features/identity/services/audit.service";

export async function registerAgentDeviceAction(formData: FormData) {
  await requirePermission("agents:write");
  const parsed = z
    .object({
      agent_id: z.string().uuid(),
      device_label: z.string().min(2),
      device_fingerprint: z.string().min(4),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase.from("agent_appareils" as never).insert({
    agent_id: parsed.data.agent_id,
    device_label: parsed.data.device_label,
    device_fingerprint: parsed.data.device_fingerprint,
    statut: "actif",
  } as never);
  revalidatePath(`/admin/agents/${parsed.data.agent_id}`);
}

export async function revokeAgentDeviceAction(formData: FormData) {
  await requirePermission("agents:write");
  const parsed = z
    .object({
      id: z.string().uuid(),
      agent_id: z.string().uuid(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase
    .from("agent_appareils" as never)
    .update({
      statut: "revoque",
      revoked_at: new Date().toISOString(),
    } as never)
    .eq("id", parsed.data.id);
  await appendAuditLog(supabase, {
    action: "agents.device.revoke",
    module: "agents",
    entityType: "agent_appareils",
    entityId: parsed.data.id,
  });
  revalidatePath(`/admin/agents/${parsed.data.agent_id}`);
}
