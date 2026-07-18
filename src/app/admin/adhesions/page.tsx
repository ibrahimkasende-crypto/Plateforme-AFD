import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { approveAdhesion, rejectAdhesion } from "@/features/adhesions/actions/manage-adhesion";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminAdhesions } from "@/lib/queries/admin/adhesions";

export default async function AdminAdhesionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requirePermission("adhesions:read");
  const { q, status } = await searchParams;
  const items = await getAdminAdhesions({ q, status });

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Adhésions"
        description="Demandes d'adhésion soumises via le site public."
      />
      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" />
        <select name="status" defaultValue={status ?? ""} className="rounded border p-2">
          <option value="">Tous</option>
          <option value="pending">En attente</option>
          <option value="approved">Approuvées</option>
          <option value="rejected">Refusées</option>
        </select>
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucune demande d'adhésion"
          description="Les candidatures membres apparaîtront ici pour validation."
          createHref="/adhesion"
          createLabel="Formulaire public"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Date</th>
                <th>Nom</th>
                <th>E-mail</th>
                <th>Type</th>
                <th>Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.created_at?.slice(0, 10) ?? "—"}</td>
                  <td>{item.full_name}</td>
                  <td>{item.email}</td>
                  <td>{item.member_type ?? "—"}</td>
                  <td>{item.status ?? "pending"}</td>
                  <td className="space-x-2 p-3 text-right">
                    {item.status !== "approved" ? (
                      <form action={approveAdhesion.bind(null, item.id)} className="inline">
                        <button type="submit" className="text-green-700">
                          Approuver
                        </button>
                      </form>
                    ) : null}
                    {item.status !== "rejected" ? (
                      <form action={rejectAdhesion.bind(null, item.id)} className="inline">
                        <button type="submit" className="text-red-700">
                          Refuser
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
