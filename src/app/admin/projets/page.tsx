import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { ImportRapportButton } from "@/features/document-intelligence/components/ImportRapportButton";
import { archiveProjet, restoreProjet } from "@/features/projets/actions/manage-projet";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminProjets } from "@/lib/queries/admin/projets";
import { getProgrammeOptions } from "@/lib/queries/admin/programmes";

export default async function AdminProjetsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    statut?: string;
    program_id?: string;
    province?: string;
  }>;
}) {
  await requirePermission("projets:read");
  const { q, statut, program_id, province } = await searchParams;
  const [items, programmes] = await Promise.all([
    getAdminProjets({ q, statut, program_id, province }),
    getProgrammeOptions(),
  ]);

  const programmeMap = new Map(programmes.map((p) => [p.id, p.title]));

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Projets</h1>
          <p className="text-sm text-[var(--afd-muted)]">Projets terrain rattachés aux programmes.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ImportRapportButton moduleCible="projets" typeDocument="rapport_projet" />
          <Link className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white" href="/admin/projets/nouvelle">
            Nouveau projet
          </Link>
        </div>
      </div>

      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" />
        <select name="statut" defaultValue={statut ?? ""} className="rounded border p-2">
          <option value="">Tous les statuts</option>
          <option value="en_cours">En cours</option>
          <option value="termine">Terminé</option>
          <option value="futur">Futur</option>
        </select>
        <select name="program_id" defaultValue={program_id ?? ""} className="rounded border p-2">
          <option value="">Tous les programmes</option>
          {programmes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
        <input
          name="province"
          defaultValue={province}
          placeholder="Province"
          className="rounded border p-2"
        />
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>
      {province ? (
        <p className="text-sm text-[var(--afd-muted)]">
          Filtre province : <strong>{province.replace(/-/g, " ")}</strong>
          {" · "}
          <Link href="/admin/projets" className="text-[var(--afd-blue)] underline">
            Effacer
          </Link>
        </p>
      ) : null}

      {items.length === 0 ? (
        <EmptyState
          title="Aucun projet enregistré"
          description="Ajoutez un projet pour documenter les interventions terrain de l'AFD."
          action={
            <Link className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white" href="/admin/projets/nouvelle">
              Nouveau projet
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Titre</th>
                <th>Programme</th>
                <th>Localisation</th>
                <th>Statut</th>
                <th>Actif</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.title}</td>
                  <td>{item.program_id ? programmeMap.get(item.program_id) ?? "—" : "—"}</td>
                  <td>{item.location}</td>
                  <td>{item.status ?? "—"}</td>
                  <td>{item.active ? "Oui" : "Non"}</td>
                  <td className="space-x-3 p-3 text-right">
                    <Link className="text-[var(--afd-blue)]" href={`/admin/projets/${item.id}/modifier`}>
                      Modifier
                    </Link>
                    {item.active ? (
                      <form action={archiveProjet.bind(null, item.id)} className="inline">
                        <button type="submit" className="text-red-700">
                          Désactiver
                        </button>
                      </form>
                    ) : (
                      <form action={restoreProjet.bind(null, item.id)} className="inline">
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
