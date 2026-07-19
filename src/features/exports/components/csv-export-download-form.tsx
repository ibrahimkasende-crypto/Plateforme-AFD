"use client";

import { useTransition } from "react";
import { downloadCsvExportAction } from "@/features/exports/actions/download-csv-export";
import { downloadXlsxExportAction } from "@/features/exports/actions/download-xlsx-export";

const MODULES = [
  { value: "stocks", label: "Stocks" },
  { value: "activites", label: "Activités" },
  { value: "beneficiaires", label: "Bénéficiaires (agrégats)" },
  { value: "urgences", label: "Urgences" },
] as const;

export function CsvExportDownloadForm() {
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-4">
      <select
        name="module"
        required
        className="rounded border p-2 text-sm"
        defaultValue="stocks"
        id="export-module"
      >
        {MODULES.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={pending}
        className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white disabled:opacity-50"
        onClick={() => {
          const select = document.getElementById("export-module") as HTMLSelectElement | null;
          const fd = new FormData();
          fd.set("module", select?.value || "stocks");
          startTransition(async () => {
            const result = await downloadCsvExportAction(fd);
            if (!result.ok) {
              window.alert(result.error);
              return;
            }
            const blob = new Blob([result.content], { type: "text/csv;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = result.filename;
            a.click();
            URL.revokeObjectURL(url);
          });
        }}
      >
        CSV
      </button>
      <button
        type="button"
        disabled={pending}
        className="rounded border px-4 py-2 text-sm disabled:opacity-50 sm:col-span-2"
        onClick={() => {
          const select = document.getElementById("export-module") as HTMLSelectElement | null;
          const fd = new FormData();
          fd.set("module", select?.value || "stocks");
          startTransition(async () => {
            const result = await downloadXlsxExportAction(fd);
            if (!result.ok) {
              window.alert(result.error);
              return;
            }
            const binary = atob(result.base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            const blob = new Blob([bytes], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = result.filename;
            a.click();
            URL.revokeObjectURL(url);
          });
        }}
      >
        Excel (XLSX)
      </button>
    </div>
  );
}
