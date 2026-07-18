import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Film, ImageIcon } from "lucide-react";
import {
  PublicPagination,
  PublicSearchForm,
} from "@/components/public/PublicPagination";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { getPublicMedia } from "@/lib/queries/public/medias";
import { parsePage, parseQuery } from "@/lib/queries/public/client";

export const metadata: Metadata = {
  title: "Médiathèque",
  description:
    "Photos, vidéos et médias des actions de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/ressources/mediatheque` },
};

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string; type?: string }>;
};

const MEDIA_TYPE_OPTIONS = [
  { value: "", label: "Tous les types" },
  { value: "photo", label: "Photos" },
  { value: "video", label: "Vidéos" },
  { value: "image", label: "Images" },
] as const;

function MediaTypeIcon({ type }: { type: string | null }) {
  if (type?.includes("video")) {
    return <Film className="size-5" aria-hidden />;
  }
  return <ImageIcon className="size-5" aria-hidden />;
}

export default async function MediathequePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = parseQuery(params.q);
  const page = parsePage(params.page);
  const mediaType = params.type?.trim() ?? "";
  const result = await getPublicMedia({
    q: q || undefined,
    page,
    mediaType: mediaType || undefined,
  });

  return (
    <PublicPageShell
      eyebrow="Ressources"
      title="Médiathèque"
      description="Galerie photos et vidéos des interventions de l’AFD."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Ressources", href: "/ressources" },
        { label: "Médiathèque" },
      ]}
    >
      <PublicSearchForm
        action="/ressources/mediatheque"
        defaultQuery={q}
        placeholder="Rechercher un média…"
        extraFields={
          <label className="flex min-w-0 w-full flex-col gap-1 text-xs font-medium text-[var(--afd-muted)] sm:min-w-[10rem] sm:w-auto">
            Type
            <select
              name="type"
              defaultValue={mediaType}
              className="rounded-lg border border-[var(--afd-border)] px-3 py-2 text-sm text-[var(--afd-ink)]"
            >
              {MEDIA_TYPE_OPTIONS.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        }
      />

      {result.items.length === 0 ? (
        <EmptyState
          title="Aucun média disponible"
          description={
            q || mediaType
              ? "Aucun résultat ne correspond à vos critères."
              : "Les photos et vidéos publiées apparaîtront ici."
          }
          action={
            <Link
              href="/contact"
              className="inline-flex min-h-10 items-center rounded-lg bg-[var(--afd-blue)] px-4 text-sm font-semibold text-white"
            >
              Nous contacter
            </Link>
          }
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-[var(--afd-muted)]">
            {result.total} média{result.total > 1 ? "s" : ""} trouvé
            {result.total > 1 ? "s" : ""}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((media) => {
              const previewUrl = media.thumbnail_url ?? media.media_url;
              const isVideo = media.media_type?.includes("video");

              return (
                <article
                  key={media.id}
                  className="overflow-hidden rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)]"
                >
                  <a
                    href={media.media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-[4/3] bg-[var(--afd-border)]/40"
                  >
                    {previewUrl && !isVideo ? (
                      <Image
                        src={previewUrl}
                        alt={media.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[var(--afd-muted)]">
                        <MediaTypeIcon type={media.media_type} />
                      </div>
                    )}
                  </a>
                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-[var(--afd-muted)]">
                      {media.media_type ?? "Média"}
                    </p>
                    <h2 className="mt-1 font-semibold text-[var(--afd-ink)]">{media.title}</h2>
                    {media.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-[var(--afd-muted)]">
                        {media.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
          <PublicPagination
            page={result.page}
            totalPages={result.totalPages}
            basePath="/ressources/mediatheque"
            searchParams={{
              q: q || undefined,
              type: mediaType || undefined,
            }}
          />
        </>
      )}
    </PublicPageShell>
  );
}
