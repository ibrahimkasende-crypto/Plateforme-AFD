import Link from "next/link";
import { AdminLibraryShell } from "@/components/admin/bibliotheque/admin-library-shell";
import { EmptyState } from "@/components/shared/EmptyState";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminBibliothequeAlbumsPage() {
  const supabase = await createClientSafe();
  const { data } = supabase
    ? await supabase
        .from("bibliotheque_evenements" as never)
        .select(
          "id, slug, titre, categorie_label, cover_image_url, publie" as never,
        )
        .eq("publie" as never, true)
        .is("deleted_at" as never, null)
        .order("updated_at" as never, { ascending: false })
        .limit(50)
    : { data: null };

  const items =
    (data as Array<{
      id: string;
      slug: string;
      titre: string;
      categorie_label: string | null;
      cover_image_url: string | null;
      publie: boolean;
    }> | null) ?? [];

  return (
    <AdminLibraryShell
      title="Albums photo"
      description="Chaque activité publiée constitue un album consultable sur le site public."
      current="/admin/bibliotheque/albums"
      action={
        <Link
          href="/admin/publications/archives/nouvelle"
          className="rounded-lg bg-[var(--admin-primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          Nouvel album / activité
        </Link>
      }
    >
      {items.length === 0 ? (
        <EmptyState
          title="Aucun album"
          description="Publiez une activité avec des photos pour créer un album."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <h2 className="font-semibold text-slate-900">{item.titre}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {item.categorie_label ?? "Sans catégorie"}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <Link
                  href={`/admin/publications/archives/${item.id}/modifier`}
                  className="font-semibold text-[var(--admin-primary)]"
                >
                  Gérer les photos
                </Link>
                <Link
                  href={`/bibliotheque/${item.slug}`}
                  target="_blank"
                  className="text-slate-600"
                >
                  Prévisualiser
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminLibraryShell>
  );
}
