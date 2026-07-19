"use client";

import { useActionState } from "react";
import {
  uploadOcrDocumentAction,
  type UploadActionState,
} from "@/features/document-intelligence/actions/upload-document";
import { DOCUMENT_TYPE_OPTIONS } from "@/features/document-intelligence/schemas/document-types";
import { PROVENANCE_SOURCES, SENSITIVITY_LEVELS } from "@/features/document-intelligence/types";

const initial: UploadActionState = { ok: true };

type Prefill = {
  module_cible?: string;
  type_document?: string;
  programme_id?: string;
  projet_id?: string;
  periode_debut?: string;
  periode_fin?: string;
  province_id?: string;
  devise?: string;
};

export function OcrUploadForm({ prefill }: { prefill: Prefill }) {
  const [state, action, pending] = useActionState(uploadOcrDocumentAction, initial);

  return (
    <form action={action} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {state.message ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      ) : null}

      <div>
        <label className="mb-1 block text-xs font-semibold">Titre</label>
        <input
          name="titre"
          required
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          placeholder="Rapport financier T1 2026"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold">Type de document</label>
          <select
            name="type_document"
            defaultValue={prefill.type_document || "rapport_activite"}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            {DOCUMENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold">Module cible</label>
          <input
            name="module_cible"
            defaultValue={prefill.module_cible || ""}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="finances"
          />
        </div>
      </div>

      <input type="hidden" name="module_source" value="import-intelligent" />
      <input type="hidden" name="programme_id" value={prefill.programme_id || ""} />
      <input type="hidden" name="projet_id" value={prefill.projet_id || ""} />
      <input type="hidden" name="province_id" value={prefill.province_id || ""} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold">Période début</label>
          <input
            type="date"
            name="periode_debut"
            defaultValue={prefill.periode_debut || ""}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold">Période fin</label>
          <input
            type="date"
            name="periode_fin"
            defaultValue={prefill.periode_fin || ""}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold">Devise</label>
          <input
            name="devise"
            defaultValue={prefill.devise || "USD"}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold">Provenance déclarée</label>
          <select
            name="provenance_source"
            defaultValue="import_admin"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            {PROVENANCE_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold">Classification</label>
        <select
          name="classification_sensibilite"
          defaultValue="interne"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          {SENSITIVITY_LEVELS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold">Fichier (PDF, image, DOCX, XLSX, CSV)</label>
        <input
          type="file"
          name="file"
          required
          accept=".pdf,.png,.jpg,.jpeg,.tif,.tiff,.docx,.xlsx,.csv,application/pdf,image/*"
          className="block w-full text-sm"
        />
      </div>

      <p className="text-[11px] text-slate-500">
        Le fichier original est conservé intact. L’OCR ne modifie jamais les données
        officielles sans validation humaine.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[var(--afd-orange)] px-4 text-sm font-bold text-white disabled:opacity-60"
      >
        {pending ? "Import en cours…" : "Téléverser et analyser"}
      </button>
    </form>
  );
}
