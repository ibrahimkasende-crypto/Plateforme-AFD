import type { Metadata } from "next";
import {
  PublicPagination,
  PublicSearchForm,
} from "@/components/public/PublicPagination";
import { NewsGrid } from "@/components/public/news/news-grid";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { getPublishedNews } from "@/lib/queries/public/news";
import { parsePage, parseQuery } from "@/lib/queries/public/client";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Actualités et communiqués de l’Alliance des Femmes pour le Développement en République démocratique du Congo.",
  alternates: { canonical: `${siteConfig.url}/actualites` },
  openGraph: {
    title: "Actualités | AFD ASBL",
    description:
      "Suivez les actions et annonces de l’Alliance des Femmes pour le Développement.",
    url: `${siteConfig.url}/actualites`,
    siteName: siteConfig.appName,
    locale: "fr_CD",
    type: "website",
  },
};

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string; categorie?: string }>;
};

export default async function ActualitesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = parseQuery(params.q);
  const page = parsePage(params.page);
  const category = params.categorie?.trim() || undefined;
  const result = await getPublishedNews({ q, page, category });

  return (
    <PublicPageShell
      eyebrow="Actualités"
      title="Actualités"
      description="Dernières nouvelles — restez informés des actions de l’AFD sur le terrain."
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
          <p className="mb-6 text-sm text-[var(--afd-muted)]">
            {result.total} article{result.total > 1 ? "s" : ""} trouvé
            {result.total > 1 ? "s" : ""}
          </p>
          <NewsGrid items={result.items} featured expandablePreview={false} />
          <PublicPagination
            page={result.page}
            totalPages={result.totalPages}
            basePath="/actualites"
            searchParams={{
              q: q || undefined,
              categorie: category,
            }}
          />
        </>
      )}
    </PublicPageShell>
  );
}
