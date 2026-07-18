import Link from "next/link";

export function AdminExportMenu({
  csvHref,
  label = "Exporter CSV",
}: {
  csvHref: string;
  label?: string;
}) {
  return (
    <Link
      href={csvHref}
      className="inline-flex h-9 items-center rounded-md border border-[var(--admin-border)] px-3 text-sm font-medium hover:bg-slate-50"
    >
      {label}
    </Link>
  );
}
