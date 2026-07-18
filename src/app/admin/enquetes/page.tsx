import Link from "next/link";
import { softDeleteEnquete } from "@/features/enquetes/actions/manage-enquete";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminEnquetes } from "@/lib/queries/admin/enquetes";

export default async function AdminEnquetesPage() {
  await requirePermission("enquetes:read");
  const items = await getAdminEnquetes();

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--afd-navy)]">Enquêtes</h1>
          <p className="mt-1 text-sm text-[var(--afd-muted)]">
            Formulaires dynamiques sans modification de code.
          </p>
        </div>
        <Link
          href="/admin/enquetes/nouvelle"
          className="rounded-lg bg-[var(--afd-blue)] px-4 py-2 text-sm font-semibold text-white"
        >
          Nouvelle enquête
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-8 text-sm text-[var(--afd-muted)]">
          Aucune enquête créée. Ajoutez une enquête puis ses questions.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--afd-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-[var(--afd-muted)]">
                <th className="p-3">Titre</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Visibilité</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3 font-medium">{item.titre}</td>
                  <td className="p-3">{item.statut}</td>
                  <td className="p-3">{item.visibilite}</td>
                  <td className="space-x-3 p-3 text-right">
                    <Link
                      className="font-semibold text-[var(--afd-blue)]"
                      href={`/admin/enquetes/${item.id}`}
                    >
                      Voir
                    </Link>
                    <Link
                      className="font-semibold text-[var(--afd-blue)]"
                      href={`/admin/enquetes/${item.id}/modifier`}
                    >
                      Modifier
                    </Link>
                    <Link
                      className="font-semibold text-[var(--afd-blue)]"
                      href={`/admin/enquetes/${item.id}/reponses`}
                    >
                      Réponses
                    </Link>
                    <form action={softDeleteEnquete} className="inline">
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" className="font-semibold text-red-600">
                        Archiver
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
