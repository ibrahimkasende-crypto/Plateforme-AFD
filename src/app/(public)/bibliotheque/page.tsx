import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LibraryActivityCard } from "@/components/public/bibliotheque/library-activity-card";
import { LibraryCategoryCard } from "@/components/public/bibliotheque/library-category-card";
import { LibrarySearchForm } from "@/components/public/bibliotheque/library-search-form";
import { LibrarySectionNav } from "@/components/public/bibliotheque/library-section-nav";
import { LibraryStatsGrid } from "@/components/public/bibliotheque/library-stats-grid";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  getArchiveTimeline,
  getLibraryCategories,
  getLibraryStats,
  getRecentLibraryActivities,
  listLibraryProvinces,
  searchLibraryActivities,
} from "@/lib/queries/public/bibliotheque";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Bibliothèque institutionnelle",
  description:
    "Découvrez les activités, réalisations, rapports, photographies et archives de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/bibliotheque` },
  openGraph: {
    title: "Bibliothèque institutionnelle AFD",
    description:
      "Découvrez les activités, réalisations, rapports, photographies et archives de l’Alliance des Femmes pour le Développement.",
    url: `${siteConfig.url}/bibliotheque`,
    type: "website",
  },
};

type PageProps = {
  searchParams: Promise<{
    q?: string;
    categorie?: string;
    statut?: string;
    province?: string;
    annee?: string;
  }>;
};

export default async function BibliothequePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [
    categories,
    categoriesWithContent,
    stats,
    activities,
    recent,
    timeline,
    provinces,
  ] = await Promise.all([
    getLibraryCategories(),
    getLibraryCategories({ withContentOnly: true }),
    getLibraryStats(),
    searchLibraryActivities({
      q: params.q,
      category: params.categorie,
      status: params.statut,
      province: params.province,
      year: params.annee,
    }),
    getRecentLibraryActivities(undefined, 6),
    getArchiveTimeline(),
    listLibraryProvinces(),
  ]);
  const activeCategory = params.categorie
    ? categories.find((c) => c.slug === params.categorie)
    : null;
  const filtering = Boolean(
    params.q ||
      params.categorie ||
      params.statut ||
      params.province ||
      params.annee,
  );
  const archived = filtering
    ? []
    : await searchLibraryActivities({ status: "archivee" });

  return (
    <PublicPageShell
      eyebrow="Centre documentaire"
      title="Bibliothèque institutionnelle"
      description="Découvrez les activités, réalisations, rapports, photographies et archives de l’Alliance des Femmes pour le Développement."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Bibliothèque" },
      ]}
    >
      <div className="space-y-10">
        <LibrarySectionNav current="/bibliotheque" />
        <LibraryStatsGrid stats={stats} />

        <Suspense
          fallback={
            <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
          }
        >
          <LibrarySearchForm categories={categoriesWithContent} />
        </Suspense>

        {!filtering ? (
          <>
            <section
              aria-labelledby="library-categories-title"
              className="space-y-5"
            >
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2
                    id="library-categories-title"
                    className="font-display text-2xl font-bold text-[var(--afd-ink)]"
                  >
                    Domaines d’intervention
                  </h2>
                  <p className="mt-1 text-sm text-[var(--afd-muted)]">
                    Naviguez par catégorie pour explorer les archives.
                  </p>
                </div>
                <Link
                  href="/bibliotheque/archives"
                  className="text-sm font-semibold text-[var(--afd-blue)] hover:underline"
                >
                  Voir les archives historiques →
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoriesWithContent.map((category) => (
                  <LibraryCategoryCard key={category.slug} category={category} />
                ))}
              </div>
            </section>

            <section
              aria-labelledby="library-recent-title"
              className="space-y-5"
            >
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2
                  id="library-recent-title"
                  className="font-display text-2xl font-bold text-[var(--afd-ink)]"
                >
                  Activités récentes
                </h2>
                <Link
                  href="/bibliotheque/phototheque"
                  className="text-sm font-semibold text-[var(--afd-blue)] hover:underline"
                >
                  Photothèque →
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {recent.map((activity) => (
                  <LibraryActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </section>

            {provinces.length > 0 ? (
              <section
                aria-labelledby="library-map-title"
                className="space-y-4 rounded-3xl border border-[var(--afd-border)] bg-gradient-to-br from-slate-50 to-white p-6"
              >
                <h2
                  id="library-map-title"
                  className="font-display text-2xl font-bold text-[var(--afd-ink)]"
                >
                  Zones d’activités documentées
                </h2>
                <p className="text-sm text-[var(--afd-muted)]">
                  Provinces où des activités ont été photographiées et archivées.
                </p>
                <ul className="flex flex-wrap gap-2">
                  {provinces.map((province) => (
                    <li key={province.slug}>
                      <Link
                        href={`/bibliotheque/provinces/${province.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--afd-border)] bg-white px-3 py-1.5 text-sm font-semibold hover:border-[var(--afd-blue)]"
                      >
                        {province.label}
                        <span className="text-[var(--afd-muted)]">
                          ({province.activityCount})
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {timeline.length > 0 ? (
              <section
                aria-labelledby="library-timeline-title"
                className="space-y-4"
              >
                <h2
                  id="library-timeline-title"
                  className="font-display text-2xl font-bold text-[var(--afd-ink)]"
                >
                  Chronologie des archives
                </h2>
                <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {timeline.map((entry) => (
                    <li key={entry.year}>
                      <Link
                        href={`/bibliotheque/archives?annee=${entry.year}`}
                        className="block rounded-2xl border border-[var(--afd-border)] bg-white p-4 hover:border-[var(--afd-blue)]"
                      >
                        <span className="font-display text-xl font-bold text-[var(--afd-ink)]">
                          {entry.year}
                        </span>
                        <span className="mt-1 block text-sm text-[var(--afd-muted)]">
                          {entry.activityCount} activité
                          {entry.activityCount > 1 ? "s" : ""}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {archived.length > 0 ? (
              <section className="rounded-3xl bg-[var(--afd-blue)] px-6 py-8 text-white">
                <h2 className="font-display text-2xl font-bold">
                  Consulter les archives
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-white/85">
                  {archived.length} activité
                  {archived.length > 1 ? "s" : ""} archivée
                  {archived.length > 1 ? "s" : ""} restent consultables —
                  aucune publication institutionnelle n’est effacée.
                </p>
                <Link
                  href="/bibliotheque/archives"
                  className="mt-4 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--afd-blue)]"
                >
                  Ouvrir les archives
                </Link>
              </section>
            ) : null}
          </>
        ) : null}

        <section
          aria-labelledby="library-activities-title"
          className="space-y-5"
        >
          <div>
            <h2
              id="library-activities-title"
              className="font-display text-2xl font-bold text-[var(--afd-ink)]"
            >
              {activeCategory
                ? activeCategory.label
                : filtering
                  ? "Résultats"
                  : "Tous les contenus"}
            </h2>
            <p className="mt-1 text-sm text-[var(--afd-muted)]">
              {activities.length} activité{activities.length > 1 ? "s" : ""}{" "}
              trouvée{activities.length > 1 ? "s" : ""}
            </p>
          </div>

          {activities.length === 0 ? (
            <EmptyState
              title="Aucune activité"
              description="Élargissez vos critères de recherche ou explorez un autre domaine."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity) => (
                <LibraryActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </section>
      </div>
    </PublicPageShell>
  );
}
