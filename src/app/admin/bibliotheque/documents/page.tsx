import Link from "next/link";
import { AdminLibraryShell } from "@/components/admin/bibliotheque/admin-library-shell";

export default async function AdminBibliothequeDocumentsPage() {
  return (
    <AdminLibraryShell
      title="Documents"
      description="Documents publics uniquement — jamais de fichiers confidentiels sur le site."
      current="/admin/bibliotheque/documents"
    >
      <div className="rounded-xl border bg-white p-6 text-sm text-slate-600">
        <p>
          Gérez les documents dans le module dédié. Seuls les documents{" "}
          <strong>publics</strong> apparaissent sur{" "}
          <Link
            href="/bibliotheque/documents"
            className="font-semibold text-[var(--admin-primary)] underline"
            target="_blank"
          >
            /bibliotheque/documents
          </Link>
          .
        </p>
        <Link
          href="/admin/documents"
          className="mt-4 inline-flex rounded-lg bg-[var(--admin-primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          Ouvrir Documents
        </Link>
      </div>
    </AdminLibraryShell>
  );
}
