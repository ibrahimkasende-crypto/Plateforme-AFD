import Link from "next/link";
import { AdminLibraryShell } from "@/components/admin/bibliotheque/admin-library-shell";
import { EmptyState } from "@/components/shared/EmptyState";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminBibliothequeArchivesPage() {
  const supabase = await createClientSafe();
  const { data } = supabase
    ? await supabase
        .from("bibliotheque_evenements" as never)
        .select(
          "id, slug, titre, statut, publie, updated_at" as never,
        )
        .in("statut" as never, ["archive", "archivee", "terminee"] as never)
        .is("deleted_at" as never, null)
        .order("updated_at" as never, { ascending: false })
        .limit(100)
    : { data: null };

  const items =
    (data as Array<{
      id: string;
      slug: string;
      titre: string;
      statut: string;
      publie: boolean;
      updated_at: string;
    }> | null) ?? [];

  return (
    <AdminLibraryShell
      title="Archives"
      description="Archivage logique uniquement — aucune suppression définitive des contenus publiés."
      current="/admin/bibliotheque/archives"
    >
      {items.length === 0 ? (
        <EmptyState
          title="Aucune archive"
          description="Les activités terminées ou archivées apparaîtront ici."
        />
      ) : (
        <ul className="divide-y rounded-xl border bg-white">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{item.titre}</p>
                <p className="text-xs text-slate-500">{item.statut}</p>
              </div>
              <Link
                href={`/admin/publications/archives/${item.id}/modifier`}
                className="text-sm font-semibold text-[var(--admin-primary)]"
              >
                Restaurer / modifier
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminLibraryShell>
  );
}
