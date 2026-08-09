import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PublicSearchField } from "@/components/public/PublicSearchField";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { parseQuery } from "@/lib/queries/public/client";
import { searchPublicContent } from "@/lib/queries/public/recherche";

export const metadata: Metadata = {
  title: "Recherche",
  description: "Rechercher des programmes, projets et actualités sur la plateforme AFD.",
  alternates: { canonical: `${siteConfig.url}/recherche` },
};

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

function SearchFieldFallback() {
  return (
    <div
      className="min-h-12 w-full animate-pulse rounded-lg bg-[var(--afd-border)]/70"
      aria-hidden
    />
  );
}

export default async function RecherchePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = parseQuery(params.q);
  const results = q ? await searchPublicContent(q) : null;

  const totalResults = results
    ? results.programmes.length +
      results.projets.length +
      results.actualites.length +
      results.bibliotheque.length
    : 0;

  return (
    <PublicPageShell
      eyebrow="Recherche"
      title="Rechercher sur le site"
      description="Trouvez des programmes, projets, actualités et contenus de la bibliothèque institutionnelle."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Recherche" },
      ]}
    >
      <Suspense fallback={<SearchFieldFallback />}>
        <PublicSearchField
          action="/recherche"
          defaultValue={q}
          placeholder="Programmes, projets, actualités, bibliothèque…"
          className="mb-8"
        />
      </Suspense>

      {!q ? (
        <EmptyState
          title="Commencez votre recherche"
          description="Saisissez un mot-clé pour explorer les contenus publiés de la plateforme."
        />
      ) : totalResults === 0 ? (
        <EmptyState
          title="Aucun résultat"
          description={`Aucun contenu publié ne correspond à « ${q} ».`}
        />
      ) : (
        <div className="space-y-10">
          {results!.programmes.length > 0 ? (
            <section>
              <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
                Programmes ({results!.programmes.length})
              </h2>
              <ul className="mt-4 space-y-3">
                {results!.programmes.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/actions/programmes/${item.slug}`}
                      className="block rounded-xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-4 transition hover:border-[var(--afd-blue)]/40"
                    >
                      <h3 className="font-semibold text-[var(--afd-ink)]">{item.title}</h3>
                      {item.description ? (
                        <p className="mt-1 line-clamp-2 text-sm text-[var(--afd-muted)]">
                          {item.description}
                        </p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {results!.projets.length > 0 ? (
            <section>
              <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
                Projets ({results!.projets.length})
              </h2>
              <ul className="mt-4 space-y-3">
                {results!.projets.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/actions/projets/${item.slug}`}
                      className="block rounded-xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-4 transition hover:border-[var(--afd-blue)]/40"
                    >
                      <h3 className="font-semibold text-[var(--afd-ink)]">{item.title}</h3>
                      {item.description ? (
                        <p className="mt-1 line-clamp-2 text-sm text-[var(--afd-muted)]">
                          {item.description}
                        </p>
                      ) : null}
                      {item.location ? (
                        <p className="mt-1 text-xs text-[var(--afd-muted)]">{item.location}</p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {results!.actualites.length > 0 ? (
            <section>
              <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
                Actualités ({results!.actualites.length})
              </h2>
              <ul className="mt-4 space-y-3">
                {results!.actualites.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/actualites/${item.slug}`}
                      className="block rounded-xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-4 transition hover:border-[var(--afd-blue)]/40"
                    >
                      <h3 className="font-semibold text-[var(--afd-ink)]">{item.title}</h3>
                      {item.excerpt ? (
                        <p className="mt-1 line-clamp-2 text-sm text-[var(--afd-muted)]">
                          {item.excerpt}
                        </p>
                      ) : null}
                      {item.category ? (
                        <p className="mt-1 text-xs text-[var(--afd-muted)]">{item.category}</p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {results!.bibliotheque.length > 0 ? (
            <section>
              <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
                Bibliothèque ({results!.bibliotheque.length})
              </h2>
              <ul className="mt-4 space-y-3">
                {results!.bibliotheque.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/bibliotheque/${item.slug}`}
                      className="block rounded-xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-4 transition hover:border-[var(--afd-blue)]/40"
                    >
                      <h3 className="font-semibold text-[var(--afd-ink)]">
                        {item.title}
                      </h3>
                      {item.summary ? (
                        <p className="mt-1 line-clamp-2 text-sm text-[var(--afd-muted)]">
                          {item.summary}
                        </p>
                      ) : null}
                      <p className="mt-1 text-xs text-[var(--afd-muted)]">
                        {item.categoryLabel}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </PublicPageShell>
  );
}
