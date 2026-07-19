"use client";

import { useState, useTransition } from "react";
import { importBeneficiairesCsvAction } from "@/features/beneficiaires/actions/manage-beneficiaire";

export function BeneficiairesImportForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    imported: number;
    duplicates: number;
    errors: string[];
  } | null>(null);

  return (
    <section className="rounded border bg-white p-4">
      <h2 className="mb-2 font-semibold">Import CSV (agrégats uniquement)</h2>
      <p className="mb-3 text-sm text-slate-600">
        Colonnes : periode;province;femmes;hommes;enfants;jeunes — aucune donnée personnelle
        individuelle. Les doublons période+province sont ignorés.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const fd = new FormData(form);
          startTransition(async () => {
            const res = await importBeneficiairesCsvAction(fd);
            setResult(res);
            form.reset();
          });
        }}
        className="flex flex-wrap items-end gap-3"
      >
        <input
          type="file"
          name="file"
          accept=".csv,text/csv"
          required
          className="text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {pending ? "Import…" : "Importer"}
        </button>
      </form>
      {result ? (
        <p className="mt-3 text-sm" role="status">
          Importés : {result.imported} · Doublons ignorés : {result.duplicates}
          {result.errors.length > 0 ? ` · Erreurs : ${result.errors.join("; ")}` : ""}
        </p>
      ) : null}
    </section>
  );
}
