import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { archiveZone } from "@/features/zones/actions/manage-zone";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminZones } from "@/lib/queries/admin/zones-intervention";

export default async function AdminZonesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requirePermission("programmes:read");
  const { q, status } = await searchParams;
  const items = await getAdminZones({ q, status });

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Zones d&apos;intervention</h1>
          <p className="text-sm text-[var(--afd-muted)]">Provinces et localités couvertes par l&apos;AFD.</p>
        </div>
        <Link className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white" href="/admin/zones-intervention/nouvelle">
          Nouvelle zone
        </Link>
      </div>

      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" />
        <select name="status" defaultValue={status ?? ""} className="rounded border p-2">
          <option value="">Tous les statuts</option>
          <option value="brouillon">Brouillon</option>
          <option value="publie">Publié</option>
          <option value="archive">Archivé</option>
        </select>
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          title="Aucune zone enregistrée"
          description="Documentez les provinces et territoires d'intervention de l'AFD."
          action={
            <Link className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white" href="/admin/zones-intervention/nouvelle">
              Nouvelle zone
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Province</th>
                <th>Localité</th>
                <th>Statut</th>
                <th>Projets</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.province}</td>
                  <td>{item.main_locality ?? "—"}</td>
                  <td>{item.status}</td>
                  <td>{item.projects_count ?? "—"}</td>
                  <td className="space-x-3 p-3 text-right">
                    <Link className="text-[var(--afd-blue)]" href={`/admin/zones-intervention/${item.id}/modifier`}>
                      Modifier
                    </Link>
                    {item.status !== "archive" ? (
                      <form action={archiveZone.bind(null, item.id)} className="inline">
                        <button type="submit" className="text-red-700">
                          Archiver
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
