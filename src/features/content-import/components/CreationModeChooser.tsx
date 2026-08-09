"use client";

import Link from "next/link";
import { FileUp, PenLine, Sparkles } from "lucide-react";
import { ENTITY_LABELS } from "@/features/content-import/field-catalog";
import type { ContentEntityType } from "@/features/content-import/types";

type Props = {
  entityType: ContentEntityType;
  manualHref: string;
  importHref: string;
  title: string;
  description?: string;
};

export function CreationModeChooser({
  entityType,
  manualHref,
  importHref,
  title,
  description,
}: Props) {
  const label = ENTITY_LABELS[entityType];

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {description ??
            `Choisissez comment créer ce ${label}. L’import intelligent est recommandé.`}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href={importHref}
          className="group relative flex flex-col gap-3 rounded-2xl border-2 border-[var(--afd-blue)] bg-gradient-to-br from-[#eaf5fd] to-white p-6 shadow-sm transition hover:shadow-md"
        >
          <span className="absolute right-3 top-3 rounded-full bg-[var(--afd-blue)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Recommandé
          </span>
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[var(--afd-blue)] text-white">
            <Sparkles className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Import intelligent
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Déposez un PDF, Word, Excel ou image. OCR + analyse automatique,
              aperçu, puis validation avant publication.
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--afd-blue)]">
            <FileUp className="size-4" aria-hidden />
            Commencer l’import
          </span>
        </Link>

        <Link
          href={manualHref}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-sm"
        >
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <PenLine className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Création manuelle
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Remplir le formulaire classique champ par champ. Solution de
              secours si vous n’avez pas de document source.
            </p>
          </div>
          <span className="mt-auto text-sm font-semibold text-slate-700">
            Ouvrir le formulaire →
          </span>
        </Link>
      </div>
    </div>
  );
}
