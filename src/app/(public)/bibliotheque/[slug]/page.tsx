import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LibraryActivityCard } from "@/components/public/bibliotheque/library-activity-card";
import { LibraryMasonryGallery } from "@/components/public/bibliotheque/library-masonry-gallery";
import { LibraryShareActions } from "@/components/public/bibliotheque/library-share-actions";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import {
  getAdjacentLibraryActivities,
  getLibraryActivityBySlug,
  getRecentLibraryActivities,
  getSimilarLibraryActivities,
  listLibraryActivities,
} from "@/lib/queries/public/bibliotheque";
import { siteConfig } from "@/config/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const activities = await listLibraryActivities();
  return activities.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const activity = await getLibraryActivityBySlug((await params).slug);
  if (!activity) return { title: "Activité introuvable" };
  const description = activity.summary.slice(0, 160);
  const url = `${siteConfig.url}/bibliotheque/${activity.slug}`;
  return {
    title: activity.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: activity.title,
      description,
      url,
      type: "article",
      images: activity.coverImageUrl
        ? [{ url: activity.coverImageUrl, alt: activity.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: activity.title,
      description,
      images: activity.coverImageUrl ? [activity.coverImageUrl] : undefined,
    },
  };
}

export default async function BibliothequeDetailPage({ params }: PageProps) {
  const activity = await getLibraryActivityBySlug((await params).slug);
  if (!activity) notFound();

  const [similar, recent, adjacent] = await Promise.all([
    getSimilarLibraryActivities(activity, 3),
    getRecentLibraryActivities(activity.slug, 3),
    getAdjacentLibraryActivities(activity.slug),
  ]);
  const sameDomain = similar.filter(
    (item) => item.domainSlug === activity.domainSlug,
  );
  const sameProject = activity.project
    ? similar.filter((item) => item.project === activity.project)
    : [];
  const sameProvince = activity.province
    ? similar.filter((item) => item.province === activity.province)
    : [];
  const url = `${siteConfig.url}/bibliotheque/${activity.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: activity.title,
    description: activity.summary,
    image: activity.coverImageUrl ? [activity.coverImageUrl] : undefined,
    datePublished: activity.publishedAt ?? activity.eventDate ?? undefined,
    dateModified: activity.updatedAt ?? undefined,
    author: { "@type": "Organization", name: activity.author },
    publisher: {
      "@type": "Organization",
      name: "Alliance des Femmes pour le Développement",
    },
    mainEntityOfPage: url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicPageShell
        eyebrow={activity.categoryLabel}
        title={activity.title}
        description={activity.summary}
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Bibliothèque", href: "/bibliotheque" },
          { label: activity.title },
        ]}
      >
        <article className="space-y-10">
          {activity.coverImageUrl ? (
            <div className="relative aspect-[21/9] min-h-[240px] overflow-hidden rounded-3xl bg-slate-100">
              <Image
                src={activity.coverImageUrl}
                alt={activity.images[0]?.alt ?? activity.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          ) : null}

          <dl className="grid gap-4 rounded-2xl border border-[var(--afd-border)] bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
                Domaine
              </dt>
              <dd className="mt-1 font-semibold text-[var(--afd-ink)]">
                <Link
                  href={`/bibliotheque/domaines/${activity.categorySlug}`}
                  className="hover:text-[var(--afd-blue)] hover:underline"
                >
                  {activity.categoryLabel}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
                Date
              </dt>
              <dd className="mt-1 font-semibold text-[var(--afd-ink)]">
                {activity.eventDate
                  ? new Date(activity.eventDate).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
                Lieu
              </dt>
              <dd className="mt-1 font-semibold text-[var(--afd-ink)]">
                {[activity.locationName, activity.locality, activity.territory, activity.province]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
                Photos
              </dt>
              <dd className="mt-1 font-semibold text-[var(--afd-ink)]">
                {activity.photoCount}
              </dd>
            </div>
            {activity.project ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
                  Projet
                </dt>
                <dd className="mt-1 font-semibold text-[var(--afd-ink)]">
                  <Link
                    href={`/bibliotheque/projets/${activity.project.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-[var(--afd-blue)] hover:underline"
                  >
                    {activity.project}
                  </Link>
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
                Statut
              </dt>
              <dd className="mt-1 font-semibold text-[var(--afd-ink)]">
                {activity.status === "en_cours"
                  ? "En cours"
                  : activity.status === "archivee"
                    ? "Archivée"
                    : "Terminée"}
              </dd>
            </div>
            {activity.partners.length > 0 ? (
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
                  Partenaires
                </dt>
                <dd className="mt-1 font-semibold text-[var(--afd-ink)]">
                  {activity.partners.join(", ")}
                </dd>
              </div>
            ) : null}
            {activity.tags.length > 0 ? (
              <div className="sm:col-span-2 lg:col-span-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
                  Tags
                </dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {activity.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
                Auteur
              </dt>
              <dd className="mt-1 font-semibold text-[var(--afd-ink)]">
                {activity.author}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
                Publication
              </dt>
              <dd className="mt-1 font-semibold text-[var(--afd-ink)]">
                {activity.publishedAt
                  ? new Date(activity.publishedAt).toLocaleDateString("fr-FR")
                  : "—"}
              </dd>
            </div>
          </dl>

          <section className="prose prose-slate max-w-none">
            <h2>Description</h2>
            <p>{activity.description}</p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-[var(--afd-ink)]">
              Galerie photo
            </h2>
            <LibraryMasonryGallery
              images={activity.images}
              activityTitle={activity.title}
            />
          </section>

          <LibraryShareActions title={activity.title} url={url} />

          <nav
            aria-label="Navigation entre activités"
            className="flex flex-wrap justify-between gap-3 text-sm"
          >
            {adjacent.previous ? (
              <Link
                href={`/bibliotheque/${adjacent.previous.slug}`}
                className="font-semibold text-[var(--afd-blue)] hover:underline"
              >
                ← {adjacent.previous.title}
              </Link>
            ) : (
              <span />
            )}
            {adjacent.next ? (
              <Link
                href={`/bibliotheque/${adjacent.next.slug}`}
                className="font-semibold text-[var(--afd-blue)] hover:underline"
              >
                {adjacent.next.title} →
              </Link>
            ) : null}
          </nav>

          {sameDomain.length > 0 ? (
            <section className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-[var(--afd-ink)]">
                Même domaine
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {sameDomain.map((item) => (
                  <LibraryActivityCard key={item.id} activity={item} />
                ))}
              </div>
            </section>
          ) : null}

          {sameProject.length > 0 ? (
            <section className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-[var(--afd-ink)]">
                Même projet
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {sameProject.map((item) => (
                  <LibraryActivityCard key={item.id} activity={item} />
                ))}
              </div>
            </section>
          ) : null}

          {sameProvince.length > 0 ? (
            <section className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-[var(--afd-ink)]">
                Même province
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {sameProvince.map((item) => (
                  <LibraryActivityCard key={item.id} activity={item} />
                ))}
              </div>
            </section>
          ) : null}

          {similar.length > 0 ? (
            <section className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-[var(--afd-ink)]">
                Activités similaires
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((item) => (
                  <LibraryActivityCard key={item.id} activity={item} />
                ))}
              </div>
            </section>
          ) : null}

          {recent.length > 0 ? (
            <section className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-[var(--afd-ink)]">
                Activités récentes
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {recent.map((item) => (
                  <LibraryActivityCard key={item.id} activity={item} />
                ))}
              </div>
            </section>
          ) : null}

          <p className="text-sm text-[var(--afd-muted)]">
            <Link
              href="/bibliotheque"
              className="font-semibold text-[var(--afd-blue)]"
            >
              ← Retour à la bibliothèque
            </Link>
          </p>
        </article>
      </PublicPageShell>
    </>
  );
}
