import Link from "next/link";
import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";
import { softDeleteTemoignage } from "@/features/impact/actions/manage-temoignage";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminTemoignages } from "@/lib/queries/admin/temoignages";

export default async function AdminTemoignagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("temoignages:write");
  const { q } = await searchParams;
  const items = await getAdminTemoignages({ q });

  return (
    <PublicationModuleShell
      title="Témoignages"
      description="Publications uniquement avec consentement validé. Aucun témoignage fictif."
      createHref="/admin/publications/temoignages/nouveau"
      createLabel="Nouveau témoignage"
    >
      <form className="flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Rechercher"
          className="rounded-lg border border-[var(--afd-border)] px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg border border-[var(--afd-border)] px-4 py-2 text-sm font-semibold"
        >
          Filtrer
        </button>
      </form>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-8 text-sm text-[var(--afd-muted)]">
          Aucun témoignage enregistré.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--afd-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--afd-border)] text-[var(--afd-muted)]">
                <th className="p-3 font-medium">Nom</th>
                <th className="p-3 font-medium">Consentement</th>
                <th className="p-3 font-medium">Publié</th>
                <th className="p-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-[var(--afd-border)]">
                  <td className="p-3 font-medium">{item.display_name}</td>
                  <td className="p-3">{item.consent_status}</td>
                  <td className="p-3">{item.publie ? "Oui" : "Non"}</td>
                  <td className="space-x-3 p-3 text-right">
                    <Link
                      href={`/admin/publications/temoignages/${item.id}/modifier`}
                      className="font-semibold text-[var(--afd-blue)]"
                    >
                      Modifier
                    </Link>
                    <form action={softDeleteTemoignage} className="inline">
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
