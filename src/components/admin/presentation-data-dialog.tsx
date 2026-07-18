"use client";

import { useState } from "react";
import { Database, RefreshCw, Trash2, X } from "lucide-react";

const BATCH_ID = "afd-presentation-2024-2026";

type PresentationDataDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function PresentationDataDialog({
  open,
  onClose,
}: PresentationDataDialogProps) {
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="presentation-data-title"
    >
      <div className="w-full max-w-md rounded-xl border border-[var(--admin-border)] bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2
              id="presentation-data-title"
              className="font-display text-lg font-bold text-[var(--admin-text)]"
            >
              Gérer les données de présentation
            </h2>
            <p className="mt-1 text-xs text-[var(--admin-muted)]">
              Action réservée au super administrateur. Les données officielles
              ne sont jamais supprimées.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="Fermer"
          >
            <X className="size-4" />
          </button>
        </div>

        <dl className="space-y-2 rounded-lg bg-slate-50 p-3 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--admin-muted)]">Lot</dt>
            <dd className="font-mono text-xs font-semibold">{BATCH_ID}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--admin-muted)]">Contenu typique</dt>
            <dd className="text-right text-xs">
              10 programmes · 30 projets · 24 mois · 20 alertes
            </dd>
          </div>
        </dl>

        <div className="mt-4 space-y-2">
          <p className="text-[11px] leading-relaxed text-[var(--admin-muted)]">
            Utilisez les scripts locaux avec confirmation explicite :
            <code className="mx-1 rounded bg-slate-100 px-1">CONFIRM=yes npm run seed:presentation</code>
            et
            <code className="mx-1 rounded bg-slate-100 px-1">CONFIRM=yes npm run seed:presentation:clean</code>
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setBusy(true);
                window.setTimeout(() => setBusy(false), 400);
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--admin-border)] px-3 text-xs font-semibold text-[var(--admin-text)] hover:bg-slate-50"
            >
              <Database className="size-3.5" aria-hidden />
              Identifier le lot
            </button>
            <button
              type="button"
              disabled
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--admin-border)] px-3 text-xs font-semibold text-slate-400"
              title="Exécuter via npm run seed:presentation"
            >
              <RefreshCw className="size-3.5" aria-hidden />
              Régénérer
            </button>
            <button
              type="button"
              disabled
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-red-200 px-3 text-xs font-semibold text-red-300"
              title="Exécuter via npm run seed:presentation:clean"
            >
              <Trash2 className="size-3.5" aria-hidden />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
