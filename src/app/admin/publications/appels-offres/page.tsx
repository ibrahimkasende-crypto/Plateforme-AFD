import Link from "next/link";
import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";
import { softDeleteAppelOffre } from "@/features/appels-offres/actions/manage-appel-offre";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminAppelsOffres } from "@/lib/queries/admin/appels-offres";

export default async function AdminAppelsOffresPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; statut?: string }>;
}) {
  await requirePermission("appels-offres:read");
  const { q, statut } = await searchParams;
  const items = await getAdminAppelsOffres({ q, statut });

  return (
    <PublicationModuleShell
      title="Appels d’offres"
      description="AO publics et documents Storage associés."
      createHref="/admin/publications/appels-offres/nouveau"
      createLabel="Nouvel appel d’offres"
    >
      <form className="flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Rechercher"
          className="rounded-lg border border-[var(--afd-border)] px-3 py-2 text-sm"
        />
        <select
          name="statut"
          defaultValue={statut ?? ""}
          className="rounded-lg border border-[var(--afd-border)] px-3 py-2 text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="brouillon">Brouillon</option>
          <option value="ouvert">Ouvert</option>
          <option value="cloture">Clôturé</option>
          <option value="suspendu">Suspendu</option>
          <option value="archive">Archivé</option>
        </select>
        <button
          type="submit"
          className="rounded-lg border border-[var(--afd-border)] px-4 py-2 text-sm font-semibold"
        >
          Filtrer
        </button>
      </form>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-8 text-sm text-[var(--afd-muted)]">
          Aucun appel d’offres enregistré.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--afd-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--afd-border)] text-[var(--afd-muted)]">
                <th className="p-3 font-medium">Titre</th>
                <th className="p-3 font-medium">Statut</th>
                <th className="p-3 font-medium">Publié</th>
                <th className="p-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-[var(--afd-border)]">
                  <td className="p-3 font-medium">{item.titre}</td>
                  <td className="p-3">{item.statut}</td>
                  <td className="p-3">{item.publie ? "Oui" : "Non"}</td>
                  <td className="space-x-3 p-3 text-right">
                    <Link
                      href={`/admin/publications/appels-offres/${item.id}/modifier`}
                      className="font-semibold text-[var(--afd-blue)]"
                    >
                      Modifier
                    </Link>
                    <form action={softDeleteAppelOffre} className="inline">
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" className="font-semibold text-red-600">
                        Archiver
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PublicationModuleShell>
  );
}
