import Link from "next/link";

export function AdminPagination({
  page,
  pageSize,
  total,
  basePath,
  query = "",
}: {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  query?: string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => {
    const params = new URLSearchParams(query);
    params.set("page", String(p));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <nav className="flex items-center justify-between gap-3 text-sm" aria-label="Pagination">
      <span className="text-[var(--admin-muted)]">
        Page {page} / {totalPages} · {total} élément{total > 1 ? "s" : ""}
      </span>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link className="rounded border px-3 py-1.5 hover:bg-slate-50" href={hrefFor(page - 1)}>
            Précédent
          </Link>
        ) : null}
        {page < totalPages ? (
          <Link className="rounded border px-3 py-1.5 hover:bg-slate-50" href={hrefFor(page + 1)}>
            Suivant
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
