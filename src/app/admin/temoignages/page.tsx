import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminTemoignages } from "@/lib/queries/admin/temoignages";

export default async function AdminTemoignagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("histoires:read");
  const { q } = await searchParams;
  const items = await getAdminTemoignages({ q });

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Témoignages"
        description="Témoignages publiés ou en cours de révision."
        createHref="/admin/publications/temoignages/nouveau"
        createLabel="Nouveau témoignage"
      />
      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" />
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucun témoignage"
          description="Collectez et publiez des témoignages avec consentement."
          createHref="/admin/publications/temoignages/nouveau"
          createLabel="Nouveau témoignage"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Nom</th>
                <th>Citation</th>
                <th>Publié</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.display_name}</td>
                  <td className="max-w-md truncate">{item.quote}</td>
                  <td>{item.publie ? "Oui" : "Non"}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/publications/temoignages/${item.id}/modifier`}
                      className="text-[var(--afd-blue)]"
                    >
                      Modifier
                    </Link>
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
