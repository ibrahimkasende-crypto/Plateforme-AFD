import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { closeUrgence } from "@/features/urgences/actions/manage-urgence";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminUrgences } from "@/lib/queries/admin/urgences";

export default async function AdminUrgencesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requirePermission("urgences:read");
  const { q, status } = await searchParams;
  const items = await getAdminUrgences({ q, status });

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Urgences"
        description="Situations d'urgence et réponses humanitaires."
        createHref="/admin/urgences/nouvelle"
        createLabel="Nouvelle urgence"
      />
      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" />
        <select name="status" defaultValue={status ?? ""} className="rounded border p-2">
          <option value="">Toutes</option>
          <option value="active">Actives</option>
          <option value="closed">Clôturées</option>
        </select>
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucune urgence enregistrée"
          description="Déclarez une urgence pour coordonner la réponse."
          createHref="/admin/urgences/nouvelle"
          createLabel="Nouvelle urgence"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Titre</th>
                <th>Province</th>
                <th>Début</th>
                <th>Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.title}</td>
                  <td>{item.province ?? "—"}</td>
                  <td>{item.started_at ?? "—"}</td>
                  <td>{item.status}</td>
                  <td className="p-3 text-right">
                    {item.status === "active" ? (
                      <form action={closeUrgence.bind(null, item.id)} className="inline">
                        <button type="submit" className="text-red-700">
                          Clôturer
                        </button>
                      </form>
                    ) : null}
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
