import Link from "next/link";
import { ArrowRight, Images, PenLine } from "lucide-react";
import { PUBLICATION_MODULES } from "@/services/publications.service";

export default function PublicationsStudioPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--afd-border)] bg-white p-6">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[var(--afd-blue)]/10 text-[var(--afd-blue)]">
            <PenLine className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-wide text-[var(--afd-blue)] uppercase">
              Administration
            </p>
            <h1 className="font-heading mt-1 text-2xl font-extrabold text-[var(--afd-navy)]">
              Studio de publication
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--afd-muted)]">
              Interface éditoriale connectée à Supabase : brouillons, publication,
              médiathèque et revalidation du site public sans redéploiement.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PUBLICATION_MODULES.map((module) => (
          <Link
            key={module.slug}
            href={module.href}
            className="group rounded-2xl border border-[var(--afd-border)] bg-white p-5 transition hover:border-[var(--afd-blue)]/40 hover:shadow-[0_12px_28px_rgba(6,38,83,0.06)]"
          >
            <p className="text-[11px] font-bold tracking-wide text-[var(--afd-orange)] uppercase">
              {module.statusLabel}
            </p>
            <h2 className="font-heading mt-2 text-lg font-bold text-[var(--afd-navy)]">
              {module.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--afd-muted)]">
              {module.description}
            </p>
            <span className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[var(--afd-blue)]">
              Ouvrir
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/admin/mediatheque"
        className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-[var(--afd-border)] bg-[var(--afd-surface)] p-5 transition hover:border-[var(--afd-blue)]/40"
      >
        <div className="flex items-start gap-3">
          <Images className="mt-0.5 size-5 text-[var(--afd-blue)]" aria-hidden />
          <div>
            <h2 className="font-heading text-lg font-bold text-[var(--afd-navy)]">
              Médiathèque Supabase
            </h2>
            <p className="mt-1 text-sm text-[var(--afd-muted)]">
              Importer, annoter et sélectionner les images et documents.
            </p>
          </div>
        </div>
        <ArrowRight className="size-4 shrink-0 text-[var(--afd-blue)]" aria-hidden />
      </Link>
    </div>
  );
}
