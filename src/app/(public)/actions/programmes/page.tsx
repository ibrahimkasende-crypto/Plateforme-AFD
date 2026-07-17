import type { Metadata } from "next";
import Link from "next/link";
import { PublicEntityCard } from "@/components/public/PublicEntityCard";
import {
  PublicPagination,
  PublicSearchForm,
} from "@/components/public/PublicPagination";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { getPublishedPrograms } from "@/lib/queries/public/programmes";
import { parsePage, parseQuery } from "@/lib/queries/public/client";

export const metadata: Metadata = {
  title: "Programmes",
  description:
    "Consultez les programmes actifs de l’Alliance des Femmes pour le Développement en République démocratique du Congo.",
  alternates: { canonical: `${siteConfig.url}/actions/programmes` },
};

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function ProgrammesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = parseQuery(params.q);
  const page = parsePage(params.page);
  const result = await getPublishedPrograms({ q, page });

  return (
    <PublicPageShell
      eyebrow="Actions"
      title="Nos programmes"
      description="Programmes publiés et actifs portés par l’AFD auprès des communautés vulnérables."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Actions", href: "/actions" },
        { label: "Programmes" },
      ]}
    >
      <PublicSearchForm
        action="/actions/programmes"
        defaultQuery={q}
        placeholder="Rechercher un programme…"
      />

      {result.items.length === 0 ? (
        <EmptyState
          title="Aucun programme publié"
          description={
            q
              ? "Aucun résultat ne correspond à votre recherche."
              : "Les programmes actifs apparaîtront ici dès leur publication."
          }
          action={
            <Link
              href="/actions/domaines-intervention"
              className="inline-flex min-h-10 items-center rounded-lg bg-[var(--afd-blue)] px-4 text-sm font-semibold text-white"
            >
              Explorer les domaines d’intervention
            </Link>
          }
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-[var(--afd-muted)]">
            {result.total} programme{result.total > 1 ? "s" : ""} trouvé
            {result.total > 1 ? "s" : ""}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((program) => (
              <PublicEntityCard
                key={program.id}
                title={program.title}
                description={program.description}
                href={`/actions/programmes/${program.slug}`}
                imageUrl={program.image_url}
              />
            ))}
          </div>
          <PublicPagination
            page={result.page}
            totalPages={result.totalPages}
            basePath="/actions/programmes"
            searchParams={{ q: q || undefined }}
          />
        </>
      )}
    </PublicPageShell>
  );
}
