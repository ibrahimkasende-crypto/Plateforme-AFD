import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { PublicPagination } from "@/components/public/PublicPagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { parsePage } from "@/lib/queries/public/client";
import { getPublishedImpactStories } from "@/lib/queries/public/impact";

export const metadata: Metadata = {
  title: "Histoires d’impact",
  description:
    "Récits de terrain et histoires d’impact de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/impact/histoires` },
  openGraph: {
    title: "Histoires d’impact | AFD",
    description:
      "Récits authentiques de transformation communautaire portés par l’AFD.",
    url: `${siteConfig.url}/impact/histoires`,
  },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HistoiresPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const result = await getPublishedImpactStories(parsePage(params.page));

  return (
    <PublicPageShell
      eyebrow="Impact"
      title="Histoires d’impact"
      description="Récits authentiques de transformation communautaire portés par l’AFD."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Impact", href: "/impact" },
        { label: "Histoires d’impact" },
      ]}
    >
      {result.items.length === 0 ? (
        <EmptyState
          title="Aucun contenu n’est actuellement publié dans cette section"
          description="Les prochaines informations seront affichées après validation par l’AFD. Aucune histoire fictive n’est présentée."
          action={
            <Link
              href="/actualites"
              className="inline-flex min-h-10 items-center rounded-lg bg-[var(--afd-blue)] px-4 text-sm font-semibold text-white"
            >
              Voir les actualités
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {result.items.map((story) => (
              <article
                key={story.id}
                className="overflow-hidden rounded-2xl border border-[var(--afd-border)] bg-white"
              >
                {story.image_url ? (
                  <div className="relative aspect-[16/10] bg-[var(--afd-surface)]">
                    <Image
                      src={story.image_url}
                      alt={story.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : null}
                <div className="space-y-3 p-5">
                  {story.location ? (
                    <p className="text-xs font-medium uppercase tracking-wide text-[var(--afd-muted)]">
                      {story.location}
                    </p>
                  ) : null}
                  <h2 className="text-xl font-semibold text-[var(--afd-ink)]">
                    <Link
                      href={`/impact/histoires/${story.slug}`}
                      className="hover:text-[var(--afd-blue)]"
                    >
                      {story.title}
                    </Link>
                  </h2>
                  {story.excerpt ? (
                    <p className="text-sm leading-relaxed text-[var(--afd-muted)]">
                      {story.excerpt}
                    </p>
                  ) : null}
                  <Link
                    href={`/impact/histoires/${story.slug}`}
                    className="inline-flex text-sm font-semibold text-[var(--afd-blue)]"
                  >
                    Lire l’histoire
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <PublicPagination
            page={result.page}
            totalPages={result.totalPages}
            basePath="/impact/histoires"
          />
        </>
      )}
    </PublicPageShell>
  );
}
