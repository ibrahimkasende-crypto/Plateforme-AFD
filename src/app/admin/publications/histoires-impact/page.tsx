import Link from "next/link";
import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";
import { softDeleteHistoire } from "@/features/impact/actions/manage-histoire";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminHistoires } from "@/lib/queries/admin/histoires";

export default async function AdminHistoiresPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requirePermission("histoires:read");
  const { q, status } = await searchParams;
  const items = await getAdminHistoires({ q, status });

  return (
    <PublicationModuleShell
      title="Histoires d’impact"
      description="Récits avec consentement de publication obligatoire. Une histoire ne peut pas être publiée si le consentement est absent ou refusé."
      createHref="/admin/publications/histoires-impact/nouvelle"
      createLabel="Nouvelle histoire"
    >
      <form className="flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Rechercher"
          className="rounded-lg border border-[var(--afd-border)] px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-lg border border-[var(--afd-border)] px-3 py-2 text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="brouillon">Brouillon</option>
          <option value="en_revision">En révision</option>
          <option value="publie">Publié</option>
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
          Aucune histoire enregistrée. Créez un brouillon, validez le
          consentement, puis publiez.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--afd-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--afd-border)] text-[var(--afd-muted)]">
                <th className="p-3 font-medium">Titre</th>
                <th className="p-3 font-medium">Consentement</th>
                <th className="p-3 font-medium">Statut</th>
                <th className="p-3 font-medium">Publié</th>
                <th className="p-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-[var(--afd-border)]">
                  <td className="p-3 font-medium text-[var(--afd-ink)]">
                    {item.title}
                  </td>
                  <td className="p-3">{item.consent_status}</td>
                  <td className="p-3">{item.status}</td>
                  <td className="p-3">{item.published ? "Oui" : "Non"}</td>
                  <td className="space-x-3 p-3 text-right">
                    <Link
                      href={`/admin/publications/histoires-impact/${item.id}/modifier`}
                      className="font-semibold text-[var(--afd-blue)]"
                    >
                      Modifier
                    </Link>
                    <form action={softDeleteHistoire} className="inline">
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        type="submit"
                        className="font-semibold text-red-600"
                      >
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
