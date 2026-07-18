import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { saveDepartement, toggleDepartementActive } from "@/features/departements/actions/manage-departement";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminDepartements } from "@/lib/queries/admin/departements";

export default async function AdminDepartementsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("equipe:read");
  const { q } = await searchParams;
  const items = await getAdminDepartements({ q });

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader title="Départements" description="Structure interne de l'organisation." />
      <form action={saveDepartement} className="grid max-w-2xl gap-3 rounded border bg-white p-4">
        <input required name="name" placeholder="Nom du département" className="rounded border p-2" />
        <textarea name="description" placeholder="Description" className="min-h-20 rounded border p-2" />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Ajouter
        </button>
      </form>
      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" />
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucun département"
          description="Créez les départements de votre organisation."
          createHref="/admin/departements"
          createLabel="Ajouter ci-dessus"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Nom</th>
                <th>Description</th>
                <th>Actif</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.name}</td>
                  <td>{item.description ?? "—"}</td>
                  <td>{item.active ? "Oui" : "Non"}</td>
                  <td className="p-3 text-right">
                    <form
                      action={toggleDepartementActive.bind(null, item.id, !item.active)}
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
