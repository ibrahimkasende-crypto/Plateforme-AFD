import Link from "next/link";
import { AdminLibraryShell } from "@/components/admin/bibliotheque/admin-library-shell";
import { EmptyState } from "@/components/shared/EmptyState";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminBibliothequeVideosPage() {
  const supabase = await createClientSafe();
  const { data } = supabase
    ? await supabase
        .from("bibliotheque_videos" as never)
        .select(
          "id, title, provider, publie, is_public, published_at" as never,
        )
        .is("deleted_at" as never, null)
        .order("updated_at" as never, { ascending: false })
        .limit(50)
    : { data: null };

  const items =
    (data as Array<{
      id: string;
      title: string;
      provider: string;
      publie: boolean;
      is_public: boolean;
      published_at: string | null;
    }> | null) ?? [];

  return (
    <AdminLibraryShell
      title="Vidéos"
      description="YouTube, Vimeo ou hébergement sécurisé — seules les URL HTTPS autorisées sont exposées au public."
      current="/admin/bibliotheque/videos"
    >
      {items.length === 0 ? (
        <EmptyState
          title="Aucune vidéo"
          description="Ajoutez des vidéos après application de la migration bibliotheque_videos. L’état vide public reste propre."
          action={
            <Link
              href="/bibliotheque/videotheque"
              target="_blank"
              className="text-[var(--admin-primary)] underline"
            >
              Voir la vidéothèque publique
            </Link>
          }
        />
      ) : (
        <ul className="divide-y rounded-xl border bg-white">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-slate-500">
                  {item.provider} · {item.publie ? "Publié" : "Brouillon"} ·{" "}
                  {item.is_public ? "Public" : "Privé"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminLibraryShell>
  );
}
