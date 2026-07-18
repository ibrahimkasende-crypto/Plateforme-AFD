import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { updateActiviteStatus } from "@/features/activites/actions/manage-activite";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminActivites } from "@/lib/queries/admin/activites";

export default async function AdminActivitesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requirePermission("activites:read");
  const { q, status } = await searchParams;
  const items = await getAdminActivites({ q, status });

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Activités"
        description="Activités terrain et événements liés aux programmes et projets."
        createHref="/admin/activites/nouvelle"
        createLabel="Nouvelle activité"
      />

      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" />
        <select name="status" defaultValue={status ?? ""} className="rounded border p-2">
          <option value="">Tous les statuts</option>
          <option value="planifiee">Planifiée</option>
          <option value="realisee">Réalisée</option>
          <option value="annulee">Annulée</option>
        </select>
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>

      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucune activité enregistrée"
          description="Créez une activité pour suivre les interventions sur le terrain."
          createHref="/admin/activites/nouvelle"
          createLabel="Nouvelle activité"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Date</th>
                <th>Titre</th>
                <th>Type</th>
                <th>Province</th>
                <th>Participants</th>
                <th>Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.activity_date ?? "—"}</td>
                  <td>{item.title}</td>
                  <td>{item.type}</td>
                  <td>{item.province ?? "—"}</td>
                  <td>{item.total}</td>
                  <td>{item.status}</td>
                  <td className="space-x-2 p-3 text-right">
                    {item.status !== "realisee" ? (
                      <form action={updateActiviteStatus.bind(null, item.id, "realisee")} className="inline">
                        <button type="submit" className="text-[var(--afd-blue)]">
                          Marquer réalisée
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
