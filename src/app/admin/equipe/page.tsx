import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { archiveMembreEquipe, restoreMembreEquipe } from "@/features/equipe/actions/manage-membre";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminMembresEquipe } from "@/lib/queries/admin/equipe";

export default async function AdminEquipePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("equipe:read");
  const { q } = await searchParams;
  const items = await getAdminMembresEquipe({ q });

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Équipe</h1>
          <p className="text-sm text-[var(--afd-muted)]">Membres de l&apos;équipe publiés sur le site.</p>
        </div>
        <Link className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white" href="/admin/equipe/nouveau">
          Nouveau membre
        </Link>
      </div>

      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" />
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          title="Aucun membre d'équipe"
          description="Ajoutez les profils de direction et du personnel à afficher publiquement."
          action={
            <Link className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white" href="/admin/equipe/nouveau">
              Nouveau membre
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Ordre</th>
                <th>Nom</th>
                <th>Fonction</th>
                <th>Genre</th>
                <th>Actif</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.order ?? 0}</td>
                  <td>{item.name}</td>
                  <td>{item.role}</td>
                  <td>{item.gender ?? "—"}</td>
                  <td>{item.active ? "Oui" : "Non"}</td>
                  <td className="space-x-3 p-3 text-right">
                    <Link className="text-[var(--afd-blue)]" href={`/admin/equipe/${item.id}/modifier`}>
                      Modifier
                    </Link>
                    {item.active ? (
                      <form action={archiveMembreEquipe.bind(null, item.id)} className="inline">
                        <button type="submit" className="text-red-700">
                          Désactiver
                        </button>
                      </form>
                    ) : (
                      <form action={restoreMembreEquipe.bind(null, item.id)} className="inline">
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
