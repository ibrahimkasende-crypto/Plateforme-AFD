import Link from "next/link";
import { AdminLibraryShell } from "@/components/admin/bibliotheque/admin-library-shell";
import { EmptyState } from "@/components/shared/EmptyState";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminBibliothequePhotosPage() {
  const supabase = await createClientSafe();
  const { data } = supabase
    ? await supabase
        .from("bibliotheque_images" as never)
        .select(
          "id, title, caption, local_asset_path, public_url, is_cover, evenement_id" as never,
        )
        .is("deleted_at" as never, null)
        .order("created_at" as never, { ascending: false })
        .limit(100)
    : { data: null };

  const items =
    (data as Array<{
      id: string;
      title: string | null;
      caption: string | null;
      local_asset_path: string | null;
      public_url: string | null;
      is_cover: boolean | null;
      evenement_id: string;
    }> | null) ?? [];

  return (
    <AdminLibraryShell
      title="Photos"
      description="Banque d’images liée aux activités de la bibliothèque."
      current="/admin/bibliotheque/photos"
    >
      {items.length === 0 ? (
        <EmptyState
          title="Aucune photo en base"
          description="Importez le catalogue ou ajoutez des images depuis une activité."
          action={
            <Link
              href="/admin/bibliotheque/import"
              className="text-[var(--admin-primary)] underline"
            >
              Ouvrir l’import
            </Link>
          }
        />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-xl border bg-white text-sm shadow-sm"
            >
              <div className="aspect-square bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.public_url || item.local_asset_path || ""}
                  alt={item.title ?? "Photo bibliothèque"}
                  className="size-full object-cover"
                />
              </div>
              <div className="space-y-1 p-2">
                <p className="line-clamp-2 font-medium">
                  {item.title ?? item.caption ?? "Sans titre"}
                </p>
                {item.is_cover ? (
                  <span className="text-[10px] font-semibold uppercase text-[var(--admin-primary)]">
                    Couverture
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminLibraryShell>
  );
}
