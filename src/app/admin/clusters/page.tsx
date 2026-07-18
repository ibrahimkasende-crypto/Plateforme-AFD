import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { saveCluster, toggleClusterActive } from "@/features/clusters/actions/manage-cluster";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminClusters } from "@/lib/queries/admin/clusters";

export default async function AdminClustersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("clusters:read");
  const { q } = await searchParams;
  const items = await getAdminClusters({ q });

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader title="Clusters" description="Regroupements thématiques affichés sur le site." />
      <form action={saveCluster} className="grid max-w-3xl gap-3 rounded border bg-white p-4 sm:grid-cols-2">
        <input required name="name" placeholder="Nom du cluster" className="rounded border p-2 sm:col-span-2" />
        <input name="type" placeholder="Type" className="rounded border p-2" />
        <input name="icon" placeholder="Icône" className="rounded border p-2" />
        <textarea name="description" placeholder="Description" className="min-h-20 rounded border p-2 sm:col-span-2" />
        <label className="inline-flex items-center gap-2 text-sm sm:col-span-2">
          <input name="active" type="checkbox" defaultChecked />
          Actif
        </label>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white sm:col-span-2">
          Créer un cluster
        </button>
      </form>
      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" />
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucun cluster"
          description="Créez des clusters pour organiser les contenus thématiques."
          createHref="/admin/clusters"
          createLabel="Créer ci-dessus"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Ordre</th>
                <th>Nom</th>
                <th>Type</th>
                <th>Actif</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.order ?? 0}</td>
                  <td>{item.name}</td>
                  <td>{item.type ?? "—"}</td>
                  <td>{item.active ? "Oui" : "Non"}</td>
                  <td className="p-3 text-right">
                    <form
                      action={toggleClusterActive.bind(null, item.id, !item.active)}
                      className="inline"
                    >
                      <button type="submit" className="text-[var(--afd-blue)]">
                        {item.active ? "Désactiver" : "Activer"}
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
