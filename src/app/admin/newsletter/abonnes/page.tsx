import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { updateAbonneStatut } from "@/features/newsletter/actions/manage-newsletter";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminAbonnes } from "@/lib/queries/admin/newsletter-admin";

export default async function AdminNewsletterAbonnesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; statut?: string }>;
}) {
  await requirePermission("newsletter:read");
  const { q, statut } = await searchParams;
  const items = await getAdminAbonnes({ q, statut });

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader title="Abonnés newsletter" description="Liste des inscriptions newsletter." />
      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" />
        <select name="statut" defaultValue={statut ?? ""} className="rounded border p-2">
          <option value="">Tous</option>
          <option value="actif">Actifs</option>
          <option value="desinscrit">Désinscrits</option>
          <option value="en_attente">En attente</option>
        </select>
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucun abonné"
          description="Les inscriptions depuis le site public apparaîtront ici."
          createHref="/newsletter"
          createLabel="Page inscription"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">E-mail</th>
                <th>Nom</th>
                <th>Statut</th>
                <th>Inscription</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.email}</td>
                  <td>{item.nom ?? "—"}</td>
                  <td>{item.statut}</td>
                  <td>{item.subscribed_at?.slice(0, 10) ?? "—"}</td>
                  <td className="p-3 text-right">
                    {item.statut === "actif" ? (
                      <form action={updateAbonneStatut.bind(null, item.id, "desinscrit")} className="inline">
                        <button type="submit" className="text-red-700">
                          Désinscrire
                        </button>
                      </form>
                    ) : (
                      <form action={updateAbonneStatut.bind(null, item.id, "actif")} className="inline">
                        <button type="submit" className="text-[var(--afd-blue)]">
                          Réactiver
                        </button>
                      </form>
                    )}
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
