import "server-only";

import ExcelJS from "exceljs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildModuleCsvExport, type ExportModule } from "@/features/exports/services/csv-export.service";

export async function buildModuleXlsxExport(
  supabase: SupabaseClient,
  module: ExportModule,
): Promise<{ filename: string; buffer: Buffer; rowCount: number }> {
  const csv = await buildModuleCsvExport(supabase, module);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(module);
  const lines = csv.content.split("\n").filter(Boolean);
  for (const line of lines) {
    sheet.addRow(line.split(";"));
  }
  const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
  return {
    filename: csv.filename.replace(/\.csv$/, ".xlsx"),
    buffer,
    rowCount: Math.max(0, lines.length - 1),
  };
}
