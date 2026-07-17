import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

function buildHref(
  basePath: string,
  page: number,
  params: Record<string, string | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  if (page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function PublicPagination({
  page,
  totalPages,
  basePath,
  searchParams = {},
  className,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const prevHref = page > 1 ? buildHref(basePath, page - 1, searchParams) : null;
  const nextHref =
    page < totalPages ? buildHref(basePath, page + 1, searchParams) : null;

  return (
    <nav
      aria-label="Pagination"
      className={cn("mt-8 flex items-center justify-between gap-4", className)}
    >
      {prevHref ? (
        <Link
          href={prevHref}
          className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-[var(--afd-border)] px-4 text-sm font-medium text-[var(--afd-ink)] transition hover:border-[var(--afd-blue)]/40"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Précédent
        </Link>
      ) : (
        <span />
      )}
      <p className="text-sm text-[var(--afd-muted)]">
        Page {page} sur {totalPages}
      </p>
      {nextHref ? (
        <Link
          href={nextHref}
          className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-[var(--afd-border)] px-4 text-sm font-medium text-[var(--afd-ink)] transition hover:border-[var(--afd-blue)]/40"
        >
          Suivant
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

export function PublicSearchForm({
  action,
  defaultQuery,
  placeholder = "Rechercher…",
  extraFields,
  className,
}: {
  action: string;
  defaultQuery?: string;
  placeholder?: string;
  extraFields?: ReactNode;
  className?: string;
}) {
  return (
    <form
      action={action}
      method="get"
      className={cn(
        "mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-[var(--afd-border)] bg-white p-4",
        className,
      )}
    >
      <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-xs font-medium text-[var(--afd-muted)]">
        Recherche
        <input
          type="search"
          name="q"
          defaultValue={defaultQuery}
          placeholder={placeholder}
          className="rounded-lg border border-[var(--afd-border)] px-3 py-2 text-sm text-[var(--afd-ink)]"
        />
      </label>
      {extraFields}
      <button
        type="submit"
        className="inline-flex min-h-10 items-center rounded-lg bg-[var(--afd-blue)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--afd-blue-hover)]"
      >
        Filtrer
      </button>
    </form>
  );
}
