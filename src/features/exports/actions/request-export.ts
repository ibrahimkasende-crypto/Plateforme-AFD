"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { enqueueBackgroundJob } from "@/features/jobs/services/jobs.service";

/**
 * Demande d'export asynchrone — le fichier sera produit par un worker.
 * Ne simule pas un export réussi.
 */
export async function requestExportJobAction(formData: FormData) {
  const session = await requirePermission("rapports:export");
  const parsed = z
    .object({
      module: z.string().min(2),
      format: z.enum(["csv", "xlsx", "pdf"]),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  await enqueueBackgroundJob(supabase, {
    type: "export.generate",
    payload: {
      module: parsed.data.module,
      format: parsed.data.format,
    },
    createdBy: session.user.id,
    idempotencyKey: `export:${parsed.data.module}:${parsed.data.format}:${session.user.id}:${Date.now()}`,
  });

  revalidatePath("/admin/exports");
}
