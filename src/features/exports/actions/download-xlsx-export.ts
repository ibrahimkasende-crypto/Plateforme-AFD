"use server";

import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { appendAuditLog } from "@/features/identity/services/audit.service";
import { buildModuleXlsxExport } from "@/features/exports/services/xlsx-export.service";
import type { ExportModule } from "@/features/exports/services/csv-export.service";

export async function downloadXlsxExportAction(
  formData: FormData,
): Promise<
  | { ok: true; filename: string; base64: string }
  | { ok: false; error: string }
> {
  await requirePermission("rapports:export");
  const parsed = z
    .object({
      module: z.enum(["stocks", "activites", "beneficiaires", "urgences"]),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Module invalide" };
  const supabase = await createClientSafe();
  if (!supabase) return { ok: false, error: "Supabase indisponible" };

  const result = await buildModuleXlsxExport(
    supabase,
    parsed.data.module as ExportModule,
  );
  await appendAuditLog(supabase, {
    action: "exports.xlsx",
    module: "exports",
    entityType: parsed.data.module,
    newValues: { rows: result.rowCount },
  });

  return {
    ok: true,
    filename: result.filename,
    base64: result.buffer.toString("base64"),
  };
}
