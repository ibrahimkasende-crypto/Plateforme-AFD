import type { ReactNode } from "react";
import Link from "next/link";
import { requirePermission } from "@/lib/auth/require-permission";
import { cn } from "@/lib/utils";

const ADMIN_LIBRARY_LINKS = [
  { href: "/admin/bibliotheque", label: "Vue d’ensemble" },
  { href: "/admin/bibliotheque/activites", label: "Activités" },
  { href: "/admin/bibliotheque/albums", label: "Albums" },
  { href: "/admin/bibliotheque/photos", label: "Photos" },
  { href: "/admin/bibliotheque/videos", label: "Vidéos" },
  { href: "/admin/bibliotheque/rapports", label: "Rapports" },
  { href: "/admin/bibliotheque/documents", label: "Documents" },
  { href: "/admin/bibliotheque/categories", label: "Catégories" },
  { href: "/admin/bibliotheque/tags", label: "Tags" },
  { href: "/admin/bibliotheque/archives", label: "Archives" },
  { href: "/admin/bibliotheque/import", label: "Import" },
  { href: "/admin/bibliotheque/parametres", label: "Paramètres" },
] as const;

export async function AdminLibraryShell({
  title,
  description,
  current,
  children,
  action,
}: {
  title: string;
  description?: string;
  current: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  await requirePermission("archives:read");

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-slate-600">{description}</p>
          ) : null}
        </div>
        {action}
      </div>

      <nav
        aria-label="Sous-modules bibliothèque"
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {ADMIN_LIBRARY_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold sm:text-sm",
              current === link.href
                ? "border-[var(--admin-primary)] bg-[var(--admin-primary)] text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="min-w-0">{children}</div>
    </main>
  );
}
