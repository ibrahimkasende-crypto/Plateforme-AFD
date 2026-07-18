import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PublicationModuleShell({
  title,
  description,
  children,
  createHref,
  createLabel = "Créer",
}: {
  title: string;
  description: string;
  children?: ReactNode;
  createHref?: string;
  createLabel?: string;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/admin/publications"
            className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[var(--afd-blue)]"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Studio de publication
          </Link>
          <h1 className="font-heading mt-2 text-2xl font-extrabold text-[var(--afd-navy)]">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--afd-muted)]">
            {description}
          </p>
        </div>
        {createHref ? (
          <Link
            href={createHref}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--afd-orange)] px-4 text-sm font-bold text-white"
          >
            {createLabel}
          </Link>
        ) : null}
      </div>
      {children}
    </div>
  );
}
