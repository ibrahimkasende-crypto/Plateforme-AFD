import Link from "next/link";
import { AdminLibraryShell } from "@/components/admin/bibliotheque/admin-library-shell";
import { EmptyState } from "@/components/shared/EmptyState";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminBibliothequePage() {
  const supabase = await createClientSafe();

  const { data } = supabase
    ? await supabase
        .from("bibliotheque_evenements" as never)
        .select(
          "id, slug, titre, categorie_label, statut, publie, cover_image_url, updated_at" as never,
        )
        .is("deleted_at" as never, null)
        .order("updated_at" as never, { ascending: false })
        .limit(100)
    : { data: null };

  const items =
    (data as Array<{
      id: string;
      slug: string;
      titre: string;
      categorie_label: string | null;
      statut: string;
      publie: boolean;
      cover_image_url: string | null;
      updated_at: string;
    }> | null) ?? [];

  return (
    <AdminLibraryShell
      title="Bibliothèque institutionnelle"
      description="Gérez les activités publiées sur /bibliotheque (création, publication, archivage)."
      current="/admin/bibliotheque"
      action={
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/publications/archives/nouvelle"
            className="rounded-lg bg-[var(--admin-primary)] px-4 py-2 text-sm font-semibold text-white"
          >
            Nouvelle activité
          </Link>
          <Link
            href="/bibliotheque"
            target="_blank"
            className="rounded-lg border px-4 py-2 text-sm font-semibold"
          >
            Voir le site public
          </Link>
        </div>
      }
    >
      {items.length === 0 ? (
        <EmptyState
          title="Aucune activité en base"
          description="Créez une activité ou lancez le seed catalogue. Le site public utilise un fallback local en attendant."
          action={
            <Link
              href="/admin/publications/archives/nouvelle"
              className="text-[var(--admin-primary)] underline"
            >
              Créer une activité
            </Link>
          }
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-xl border bg-white md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Titre</th>
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Publié</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{item.titre}</td>
                    <td className="px-4 py-3">{item.categorie_label ?? "—"}</td>
                    <td className="px-4 py-3">{item.statut}</td>
                    <td className="px-4 py-3">{item.publie ? "Oui" : "Non"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/publications/archives/${item.id}/modifier`}
                          className="text-[var(--admin-primary)] underline"
                        >
                          Modifier
                        </Link>
                        <Link
                          href={`/bibliotheque/${item.slug}`}
                          target="_blank"
                          className="text-slate-600 underline"
                        >
                          Voir
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="grid gap-3 md:hidden">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border bg-white p-4 shadow-sm"
              >
                <p className="font-semibold text-slate-900">{item.titre}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.categorie_label ?? "—"} · {item.statut} ·{" "}
                  {item.publie ? "Publié" : "Brouillon"}
                </p>
                <div className="mt-3 flex gap-3 text-sm">
                  <Link
                    href={`/admin/publications/archives/${item.id}/modifier`}
                    className="font-semibold text-[var(--admin-primary)]"
                  >
                    Modifier
                  </Link>
                  <Link
                    href={`/bibliotheque/${item.slug}`}
                    target="_blank"
                    className="text-slate-600"
                  >
                    Voir
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </AdminLibraryShell>
  );
}
