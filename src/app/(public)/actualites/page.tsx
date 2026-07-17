import type { Metadata } from "next";
import { PublicEntityCard } from "@/components/public/PublicEntityCard";
import {
  PublicPagination,
  PublicSearchForm,
} from "@/components/public/PublicPagination";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { getPublishedNews } from "@/lib/queries/public/actualites";
import { parsePage, parseQuery } from "@/lib/queries/public/client";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Actualités et communiqués de l’Alliance des Femmes pour le Développement en République démocratique du Congo.",
  alternates: { canonical: `${siteConfig.url}/actualites` },
};

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function ActualitesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = parseQuery(params.q);
  const page = parsePage(params.page);
  const result = await getPublishedNews({ q, page });

  return (
    <PublicPageShell
      eyebrow="Actualités"
      title="Actualités"
      description="Suivez les actions, événements et annonces de l’AFD."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Actualités" },
      ]}
    >
      <PublicSearchForm
        action="/actualites"
        defaultQuery={q}
        placeholder="Rechercher une actualité…"
      />

      {result.items.length === 0 ? (
        <EmptyState
          title="Aucune actualité publiée"
          description={
            q
              ? "Aucun résultat ne correspond à votre recherche."
              : "Les actualités publiées apparaîtront ici."
          }
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-[var(--afd-muted)]">
            {result.total} article{result.total > 1 ? "s" : ""} trouvé
            {result.total > 1 ? "s" : ""}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((article) => {
              const date = formatDate(article.published_at);
              const meta = [article.category, date].filter(Boolean).join(" · ");

              return (
                <PublicEntityCard
                  key={article.id}
                  title={article.title}
                  description={article.excerpt}
                  href={`/actualites/${article.slug}`}
                  imageUrl={article.image_url}
                  meta={meta || undefined}
                />
              );
            })}
          </div>
          <PublicPagination
            page={result.page}
            totalPages={result.totalPages}
            basePath="/actualites"
            searchParams={{ q: q || undefined }}
          />
        </>
      )}
    </PublicPageShell>
  );
}
