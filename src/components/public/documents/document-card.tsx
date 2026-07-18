import Link from "next/link";
import { FileText } from "lucide-react";
import type { DocumentCentre } from "@/features/documents/types";

export function DocumentCard({ document }: { document: DocumentCentre }) {
  return (
    <article className="flex gap-4 rounded-2xl border border-[var(--afd-border)] bg-white p-5">
      <FileText className="mt-1 size-5 shrink-0 text-[var(--afd-accent)]" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--afd-muted)]">{document.type}</p>
        <h2 className="mt-1 font-semibold text-[var(--afd-ink)]">
          <Link href={`/ressources/documents/${document.slug}`} className="hover:underline">{document.titre}</Link>
        </h2>
        {document.description ? <p className="mt-1 text-sm text-[var(--afd-muted)]">{document.description}</p> : null}
      </div>
      <Link href={`/ressources/documents/${document.slug}`} className="self-center text-sm font-semibold text-[var(--afd-blue)] hover:underline">Voir</Link>
    </article>
  );
}
