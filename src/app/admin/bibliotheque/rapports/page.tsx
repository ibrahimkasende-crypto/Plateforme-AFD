import Link from "next/link";
import { AdminLibraryShell } from "@/components/admin/bibliotheque/admin-library-shell";

export default async function AdminBibliothequeRapportsPage() {
  return (
    <AdminLibraryShell
      title="Rapports"
      description="Les rapports publics sont gérés dans le centre documentaire (type rapport)."
      current="/admin/bibliotheque/rapports"
    >
      <div className="rounded-xl border bg-white p-6 text-sm text-slate-600">
        <p>
          Utilisez le module Documents pour publier un rapport public. Il
          apparaîtra automatiquement sur{" "}
          <Link
            href="/bibliotheque/rapports"
            className="font-semibold text-[var(--admin-primary)] underline"
            target="_blank"
          >
            /bibliotheque/rapports
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
