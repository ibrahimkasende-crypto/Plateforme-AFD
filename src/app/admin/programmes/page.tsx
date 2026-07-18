import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { archiveProgramme, restoreProgramme } from "@/features/programmes/actions/manage-programme";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminProgrammes } from "@/lib/queries/admin/programmes";

export default async function AdminProgrammesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; actif?: string }>;
}) {
  await requirePermission("programmes:read");
  const { q, actif } = await searchParams;
  const items = await getAdminProgrammes({ q, actif });

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Programmes</h1>
          <p className="text-sm text-[var(--afd-muted)]">
            Domaines et axes d&apos;intervention de l&apos;AFD.
          </p>
        </div>
        <Link className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white" href="/admin/programmes/nouvelle">
          Nouveau programme
        </Link>
      </div>

      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" />
        <select name="actif" defaultValue={actif ?? ""} className="rounded border p-2">
          <option value="">Tous</option>
          <option value="1">Actifs</option>
          <option value="0">Inactifs</option>
        </select>
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          title="Aucun programme enregistré"
          description="Créez un premier programme pour structurer les projets et activités de l'AFD."
          action={
            <Link className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white" href="/admin/programmes/nouvelle">
              Nouveau programme
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Ordre</th>
                <th>Titre</th>
                <th>Slug</th>
                <th>Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.order ?? 0}</td>
                  <td>{item.title}</td>
                  <td>{item.slug}</td>
                  <td>{item.active ? "Actif" : "Inactif"}</td>
                  <td className="space-x-3 p-3 text-right">
                    <Link className="text-[var(--afd-blue)]" href={`/admin/programmes/${item.id}/modifier`}>
                      Modifier
                    </Link>
                    {item.active ? (
                      <form action={archiveProgramme.bind(null, item.id)} className="inline">
                        <button type="submit" className="text-red-700">
                          Désactiver
                        </button>
                      </form>
                    ) : (
                      <form action={restoreProgramme.bind(null, item.id)} className="inline">
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
