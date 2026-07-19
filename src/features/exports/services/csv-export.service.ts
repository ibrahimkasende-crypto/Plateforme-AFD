import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export type ExportModule = "stocks" | "activites" | "beneficiaires" | "urgences";

function toCsv(rows: Array<Record<string, string | number | null | undefined>>): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: string | number | null | undefined) => {
    const s = v == null ? "" : String(v);
    if (/[",;\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  return [
    headers.join(";"),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(";")),
  ].join("\n");
}

export async function buildModuleCsvExport(
  supabase: SupabaseClient,
  module: ExportModule,
): Promise<{ filename: string; content: string; rowCount: number }> {
  if (module === "stocks") {
    const { data } = await supabase
      .from("stock_articles" as never)
      .select("sku, nom, seuil_min, unite_code, actif")
      .eq("actif", true)
      .limit(2000);
    const rows = (data ?? []) as Array<Record<string, string | number | null>>;
    return {
      filename: `stocks-${new Date().toISOString().slice(0, 10)}.csv`,
      content: toCsv(rows),
      rowCount: rows.length,
    };
  }

  if (module === "activites") {
    const { data } = await supabase
      .from("activites" as never)
      .select("title, type, activity_date, province, total, status")
      .eq("active", true)
      .limit(2000);
    const rows = (data ?? []) as Array<Record<string, string | number | null>>;
    return {
      filename: `activites-${new Date().toISOString().slice(0, 10)}.csv`,
      content: toCsv(rows),
      rowCount: rows.length,
    };
  }

  if (module === "beneficiaires") {
    const { data } = await supabase
      .from("beneficiaires_agregats" as never)
      .select("periode, province, femmes, hommes, enfants, jeunes, total")
      .limit(2000);
    const rows = (data ?? []) as Array<Record<string, string | number | null>>;
    return {
      filename: `beneficiaires-${new Date().toISOString().slice(0, 10)}.csv`,
      content: toCsv(rows),
      rowCount: rows.length,
    };
  }

  const { data } = await supabase
    .from("urgences" as never)
    .select("title, province, status, started_at, ended_at")
    .limit(2000);
  const rows = (data ?? []) as Array<Record<string, string | number | null>>;
  return {
    filename: `urgences-${new Date().toISOString().slice(0, 10)}.csv`,
    content: toCsv(rows),
    rowCount: rows.length,
  };
}
