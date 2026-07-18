import Link from "next/link";
import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";
import { listNewsForAdmin } from "@/services/news.service";

export default async function AdminPublicationsActualitesPage() {
  const items = await listNewsForAdmin();

  return (
    <PublicationModuleShell
      title="Actualités"
      description="Créez, révisez et publiez les actualités. Les images doivent provenir de la médiathèque Supabase."
      createHref="/admin/publications/actualites/nouvelle"
      createLabel="Nouvelle actualité"
    >
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-8 text-sm text-[var(--afd-muted)]">
          Aucune actualité en base pour le moment. Les sujets migrés locaux
          restent disponibles en secours sur le site public jusqu’à publication
          Supabase.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--afd-border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--afd-surface)] text-[12px] tracking-wide text-[var(--afd-muted)] uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Titre</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 font-semibold">Catégorie</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-[var(--afd-border)]">
                  <td className="px-4 py-3 font-medium text-[var(--afd-navy)]">
                    {item.title}
                  </td>
                  <td className="px-4 py-3 text-[var(--afd-muted)]">
                    {item.published ? "Publié" : "Brouillon"}
                  </td>
                  <td className="px-4 py-3 text-[var(--afd-muted)]">
                    {item.category ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/publications/actualites/${item.id}/modifier`}
                      className="font-semibold text-[var(--afd-blue)] hover:underline"
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
    </PublicationModuleShell>
  );
}
