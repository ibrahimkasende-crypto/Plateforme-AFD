"use client";

import { useMemo, useState } from "react";
import { correctOcrFieldAction } from "@/features/document-intelligence/actions/review-document";
import { DocumentStatusBadge } from "@/features/document-intelligence/components/DocumentStatusBadge";
import { IntegrityStatusBadge } from "@/features/document-intelligence/components/IntegrityStatusBadge";
import { cn } from "@/lib/utils";

export type ReviewField = {
  id: string;
  field_key: string;
  field_label: string | null;
  raw_value: string | null;
  corrected_value: string | null;
  confidence: number | null;
  review_status: string;
  page_number: number | null;
};

export type ReviewAnomaly = {
  id: string;
  message: string;
  severity: string;
  status: string;
};

type ReviewWorkspaceProps = {
  documentId: string;
  titre: string;
  status: string;
  typeDocument: string;
  integrityStatus: string | null;
  previewUrl: string | null;
  mimeType: string | null;
  fields: ReviewField[];
  anomalies: ReviewAnomaly[];
  tables: Array<{ id: string; headers: unknown; cells: unknown; confidence: number | null }>;
};

function confidenceTone(c: number | null) {
  if (c == null) return "border-slate-200";
  if (c >= 0.85) return "border-emerald-300 bg-emerald-50/40";
  if (c >= 0.65) return "border-amber-300 bg-amber-50/50";
  return "border-red-300 bg-red-50/50";
}

export function ReviewWorkspace({
  documentId,
  titre,
  status,
  typeDocument,
  integrityStatus,
  previewUrl,
  mimeType,
  fields,
  anomalies,
  tables,
}: ReviewWorkspaceProps) {
  const [selectedId, setSelectedId] = useState<string | null>(fields[0]?.id ?? null);
  const [tab, setTab] = useState<"document" | "donnees" | "anomalies">("document");
  const selected = useMemo(
    () => fields.find((f) => f.id === selectedId) ?? null,
    [fields, selectedId],
  );

  return (
    <div className="flex min-h-[70vh] flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6">
      <div className="flex gap-2 lg:hidden">
        {(
          [
            ["document", "Document"],
            ["donnees", "Données"],
            ["anomalies", "Anomalies"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-semibold",
              tab === key
                ? "bg-[var(--admin-primary)] text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <section
        className={cn(
          "overflow-hidden rounded-xl border border-slate-200 bg-slate-950/95 shadow-sm",
          tab !== "document" && "hidden lg:block",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white">
          <div>
            <p className="font-display text-sm font-semibold">{titre}</p>
            <p className="text-[11px] text-white/60">{typeDocument}</p>
          </div>
          <DocumentStatusBadge status={status} />
        </div>
        <div className="min-h-[420px] bg-black/40 p-2">
          {previewUrl ? (
            mimeType?.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Aperçu document"
                className="mx-auto max-h-[70vh] object-contain"
              />
            ) : (
              <iframe
                title="Aperçu document"
                src={previewUrl}
                className="h-[70vh] w-full rounded-md bg-white"
              />
            )
          ) : (
            <p className="p-8 text-center text-sm text-white/70">
              Aperçu indisponible (URL signée requise).
            </p>
          )}
        </div>
      </section>

      <section
        className={cn(
          "flex flex-col gap-4",
          tab === "document" && "hidden lg:flex",
          tab === "anomalies" && "hidden lg:flex",
          tab === "donnees" && "flex",
        )}
      >
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Révision des données
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Aucune donnée n’est officielle avant approbation.
              </p>
            </div>
            <IntegrityStatusBadge status={integrityStatus} />
          </div>
        </div>

        <div className="max-h-[50vh] space-y-2 overflow-auto rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          {fields.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">Aucun champ extrait.</p>
          ) : (
            fields.map((field) => (
              <button
                key={field.id}
                type="button"
                onClick={() => setSelectedId(field.id)}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-left transition",
                  confidenceTone(field.confidence),
                  selectedId === field.id && "ring-2 ring-[var(--admin-primary)]",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-800">
                    {field.field_label || field.field_key}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {field.confidence != null
                      ? `${Math.round(field.confidence * 100)} %`
                      : "—"}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-slate-600">
                  {field.corrected_value || field.raw_value || "—"}
                </p>
              </button>
            ))
          )}
        </div>

        {selected ? (
          <form
            action={correctOcrFieldAction}
            className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <input type="hidden" name="documentId" value={documentId} />
            <input type="hidden" name="fieldId" value={selected.id} />
            <label className="block text-xs font-semibold text-slate-700">
              Valeur corrigée — {selected.field_key}
              <input
                name="correctedValue"
                defaultValue={selected.corrected_value || selected.raw_value || ""}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                name="action"
                value="confirm"
                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white"
              >
                Confirmer
              </button>
              <button
                name="action"
                value="correct"
                className="rounded-lg bg-[var(--admin-primary)] px-3 py-2 text-xs font-bold text-white"
              >
                Corriger
              </button>
              <button
                name="action"
                value="ignore"
                className="rounded-lg bg-slate-200 px-3 py-2 text-xs font-bold text-slate-700"
              >
                Ignorer
              </button>
              <button
                name="action"
                value="missing"
                className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-bold text-amber-900"
              >
                Introuvable
              </button>
            </div>
          </form>
        ) : null}

        {tables.length > 0 ? (
          <div className="overflow-auto rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tableaux extraits
            </p>
            {tables.map((table) => {
              const headers = Array.isArray(table.headers)
                ? (table.headers as string[])
                : [];
              const rows = Array.isArray(table.cells)
                ? (table.cells as string[][])
                : [];
              return (
                <div key={table.id} className="mb-4 overflow-x-auto">
                  <table className="min-w-full text-left text-xs">
                    <thead>
                      <tr>
                        {headers.map((h) => (
                          <th key={h} className="border-b px-2 py-1 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr key={i} className="odd:bg-slate-50">
                          {row.map((cell, j) => (
                            <td key={j} className="px-2 py-1">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        ) : null}
      </section>

      <section
        className={cn(
          "lg:col-span-2",
          tab !== "anomalies" && "hidden lg:block",
        )}
      >
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-display text-base font-bold">Anomalies</h3>
          <p className="mt-1 text-xs text-slate-500">
            Informations / avertissements / risques — jamais une accusation automatique.
          </p>
          <ul className="mt-3 space-y-2">
            {anomalies.length === 0 ? (
              <li className="text-sm text-slate-500">Aucune anomalie ouverte.</li>
            ) : (
              anomalies.map((a) => (
                <li
                  key={a.id}
                  className="rounded-lg border border-slate-100 px-3 py-2 text-sm"
                >
                  <span className="mr-2 text-[11px] font-bold uppercase text-slate-500">
                    {a.severity}
                  </span>
                  {a.message}
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
