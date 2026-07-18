import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { updatePartenariatStatus } from "@/features/partenariats/actions/manage-partenariat";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminPartenariats } from "@/lib/queries/admin/partenariats";

export default async function AdminPartenariatsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requirePermission("partenaires:read");
  const { q, status } = await searchParams;
  const items = await getAdminPartenariats({ q, status });

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Demandes de partenariat"
        description="Sollicitations reçues via le site public."
      />
      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" />
        <select name="status" defaultValue={status ?? ""} className="rounded border p-2">
          <option value="">Tous</option>
          <option value="nouveau">Nouveau</option>
          <option value="en_cours">En cours</option>
          <option value="accepte">Accepté</option>
          <option value="refuse">Refusé</option>
        </select>
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucune demande"
          description="Les demandes de partenariat apparaîtront ici."
          createHref="/partenaires"
          createLabel="Page partenaires"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Date</th>
                <th>Organisation</th>
                <th>Contact</th>
                <th>Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.created_at?.slice(0, 10) ?? "—"}</td>
                  <td>{item.organization_name}</td>
                  <td>{item.contact_email}</td>
                  <td>{item.status}</td>
                  <td className="space-x-2 p-3 text-right">
                    <form action={updatePartenariatStatus.bind(null, item.id, "en_cours")} className="inline">
                      <button type="submit" className="text-[var(--afd-blue)]">
                        Traiter
                      </button>
                    </form>
                    <form action={updatePartenariatStatus.bind(null, item.id, "accepte")} className="inline">
                      <button type="submit" className="text-green-700">
                        Accepter
                      </button>
                    </form>
                    <form action={updatePartenariatStatus.bind(null, item.id, "refuse")} className="inline">
                      <button type="submit" className="text-red-700">
                        Refuser
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
