import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { updateRapportStatus } from "@/features/rapports/actions/manage-rapport";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminRapports } from "@/lib/queries/admin/rapports";

export default async function AdminRapportsHistoriquePage() {
  await requirePermission("rapports:read");
  const items = await getAdminRapports();

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Historique des rapports"
        description="Rapports générés et exportés."
        createHref="/admin/rapports/nouveau"
        createLabel="Nouveau rapport"
      />
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucun rapport généré"
          description="Créez un rapport pour documenter l'activité ou l'impact."
          createHref="/admin/rapports/nouveau"
          createLabel="Nouveau rapport"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Date</th>
                <th>Titre</th>
                <th>Type</th>
                <th>Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.created_at?.slice(0, 10) ?? "—"}</td>
                  <td>{item.title}</td>
                  <td>{item.type}</td>
                  <td>{item.status}</td>
                  <td className="space-x-2 p-3 text-right">
                    {item.file_url ? (
                      <a href={item.file_url} className="text-[var(--afd-blue)]">
                        Télécharger
                      </a>
                    ) : null}
                    {item.status === "brouillon" ? (
                      <form action={updateRapportStatus.bind(null, item.id, "finalise")} className="inline">
                        <button type="submit" className="text-green-700">
                          Finaliser
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
