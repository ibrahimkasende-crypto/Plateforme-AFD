import type { Metadata } from "next";
import { LibrarySectionNav } from "@/components/public/bibliotheque/library-section-nav";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { withClient } from "@/lib/queries/public/client";

export const metadata: Metadata = {
  title: "Vidéothèque institutionnelle",
  description:
    "Vidéos des activités, missions et événements de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/bibliotheque/videotheque` },
};

type LibraryVideo = {
  id: string;
  title: string;
  description: string | null;
  provider: string;
  embed_url: string | null;
  external_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  published_at: string | null;
};

async function listPublicVideos(): Promise<LibraryVideo[]> {
  return withClient([], async (supabase) => {
    const { data, error } = await supabase
      .from("bibliotheque_videos" as never)
      .select(
        "id, title, description, provider, embed_url, external_url, thumbnail_url, duration_seconds, published_at" as never,
      )
      .eq("is_public" as never, true)
      .eq("publie" as never, true)
      .is("deleted_at" as never, null)
      .order("published_at" as never, { ascending: false });
    if (error || !data) return [];
    return data as unknown as LibraryVideo[];
  });
}

function isSafeVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.replace(/^www\./, "");
    return (
      host === "youtube.com" ||
      host === "youtu.be" ||
      host === "youtube-nocookie.com" ||
      host === "vimeo.com" ||
      host === "player.vimeo.com"
    );
  } catch {
    return false;
  }
}

export default async function VideothequePage() {
  const videos = await listPublicVideos();

  return (
    <PublicPageShell
      eyebrow="Bibliothèque institutionnelle"
      title="Vidéothèque"
      description="Films, reportages et capsules vidéo documentant les actions de l’AFD."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Bibliothèque", href: "/bibliotheque" },
        { label: "Vidéothèque" },
      ]}
    >
      <div className="space-y-8">
        <LibrarySectionNav current="/bibliotheque/videotheque" />

        {videos.length === 0 ? (
          <EmptyState
            title="Aucune vidéo publiée pour le moment"
            description="Les vidéos YouTube, Vimeo ou hébergées seront listées ici dès leur publication depuis le tableau de bord."
          />
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => {
              const safe =
                isSafeVideoUrl(video.embed_url) ||
                isSafeVideoUrl(video.external_url);
              return (
                <li
                  key={video.id}
                  className="overflow-hidden rounded-2xl border border-[var(--afd-border)] bg-white shadow-sm"
                >
                  {safe && video.embed_url && isSafeVideoUrl(video.embed_url) ? (
                    <div className="aspect-video bg-black">
                      <iframe
                        title={video.title}
                        src={video.embed_url}
                        className="size-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    </div>
                  ) : null}
                  <div className="space-y-2 p-4">
                    <h2 className="font-display text-lg font-bold text-[var(--afd-ink)]">
                      {video.title}
                    </h2>
                    {video.description ? (
                      <p className="text-sm text-[var(--afd-muted)]">
                        {video.description}
                      </p>
                    ) : null}
                    {safe && video.external_url ? (
                      <a
                        href={video.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm font-semibold text-[var(--afd-blue)] hover:underline"
                      >
                        Ouvrir la vidéo
                      </a>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PublicPageShell>
  );
}
