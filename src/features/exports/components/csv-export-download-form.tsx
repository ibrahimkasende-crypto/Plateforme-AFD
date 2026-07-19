"use client";

import { useTransition } from "react";
import { downloadCsvExportAction } from "@/features/exports/actions/download-csv-export";

const MODULES = [
  { value: "stocks", label: "Stocks" },
  { value: "activites", label: "Activités" },
  { value: "beneficiaires", label: "Bénéficiaires (agrégats)" },
  { value: "urgences", label: "Urgences" },
] as const;

export function CsvExportDownloadForm() {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-3"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
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
      <select name="module" required className="rounded border p-2 text-sm" defaultValue="stocks">
        {MODULES.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white disabled:opacity-50 sm:col-span-2"
      >
        {pending ? "Génération…" : "Télécharger CSV (immédiat)"}
      </button>
    </form>
  );
}
