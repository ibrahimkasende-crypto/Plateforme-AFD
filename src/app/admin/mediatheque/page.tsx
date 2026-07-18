import Link from "next/link";
import { MediaUploader } from "@/components/admin/media/MediaUploader";
import { listMedia } from "@/services/media.service";

export default async function MediathequePage() {
  const items = await listMedia({ limit: 60 });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-wide text-[var(--afd-blue)] uppercase">
          Administration
        </p>
        <h1 className="font-heading mt-1 text-2xl font-extrabold text-[var(--afd-navy)]">
          Médiathèque
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--afd-muted)]">
          Fichiers stockés dans Supabase Storage, métadonnées dans la table
          medias. Utilisable depuis le Studio de publication.
        </p>
        <Link
          href="/admin/publications"
          className="mt-3 inline-flex text-sm font-semibold text-[var(--afd-blue)]"
        >
          ← Retour au Studio
        </Link>
      </div>

      <MediaUploader bucket="actualites" />

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-8 text-sm text-[var(--afd-muted)]">
          Aucun média enregistré pour le moment. Importez des fichiers après
          application de la migration Storage, ou exécutez le script de
          migration locale contrôlé.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-[var(--afd-border)] bg-white p-3"
            >
              <div className="aspect-video rounded-xl bg-[var(--afd-light-blue)]" />
              <p className="mt-2 line-clamp-2 text-sm font-semibold text-[var(--afd-navy)]">
                {item.original_filename ?? item.filename}
              </p>
              <p className="mt-1 text-[12px] text-[var(--afd-muted)]">
                {item.bucket}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
