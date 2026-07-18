import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  activateChiffreImpact,
  deactivateChiffreImpact,
} from "@/features/indicateurs/actions/manage-chiffre-impact";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminChiffresImpact } from "@/lib/queries/admin/chiffres-impact";

export default async function AdminIndicateursPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("indicateurs:read");
  const { q } = await searchParams;
  const items = await getAdminChiffresImpact({ q });

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Indicateurs d&apos;impact</h1>
          <p className="text-sm text-[var(--afd-muted)]">
            Chiffres clés affichés sur le site — seuls les indicateurs validés sont publics.
          </p>
        </div>
        <Link className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white" href="/admin/indicateurs/nouveau">
          Nouvel indicateur
        </Link>
      </div>

      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" />
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          title="Aucun indicateur chiffré"
          description="Ajoutez des chiffres d'impact validés pour la page Notre impact."
          action={
            <Link className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white" href="/admin/indicateurs/nouveau">
              Nouvel indicateur
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Ordre</th>
                <th>Libellé</th>
                <th>Valeur</th>
                <th>Validé</th>
                <th>Actif</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.order_index}</td>
                  <td>{item.label}</td>
                  <td>
                    {item.value ?? "—"}
                    {item.suffix ? ` ${item.suffix}` : item.unit ? ` ${item.unit}` : ""}
                  </td>
                  <td>{item.validated ? "Oui" : "Non"}</td>
                  <td>{item.active ? "Oui" : "Non"}</td>
                  <td className="space-x-3 p-3 text-right">
                    <Link className="text-[var(--afd-blue)]" href={`/admin/indicateurs/${item.id}/modifier`}>
                      Modifier
                    </Link>
                    {item.active ? (
                      <form action={deactivateChiffreImpact.bind(null, item.id)} className="inline">
                        <button type="submit" className="text-red-700">
                          Désactiver
                        </button>
                      </form>
                    ) : (
                      <form action={activateChiffreImpact.bind(null, item.id)} className="inline">
                        <button type="submit" className="text-[var(--afd-blue)]">
                          Activer
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
