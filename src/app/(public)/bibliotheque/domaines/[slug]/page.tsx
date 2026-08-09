import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LibraryActivityCard } from "@/components/public/bibliotheque/library-activity-card";
import { LibrarySectionNav } from "@/components/public/bibliotheque/library-section-nav";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import {
  getLibraryActivitiesByDomain,
  getLibraryCategories,
} from "@/lib/queries/public/bibliotheque";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const categories = await getLibraryCategories({ withContentOnly: true });
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getLibraryCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Domaine introuvable" };
  return {
    title: `Bibliothèque — ${category.label}`,
    description: `Activités documentées dans le domaine ${category.label}.`,
    alternates: {
      canonical: `${siteConfig.url}/bibliotheque/domaines/${slug}`,
    },
  };
}

export default async function BibliothequeDomainePage({ params }: PageProps) {
  const { slug } = await params;
  const categories = await getLibraryCategories();
  const category = categories.find(
    (c) => c.slug === slug || c.domainSlug === slug,
  );
  const activities = await getLibraryActivitiesByDomain(slug);
  if (!category && activities.length === 0) notFound();

  const title = category?.label ?? slug;

  return (
    <PublicPageShell
      eyebrow="Bibliothèque · Domaine"
      title={title}
      description={`Activités, albums et archives liés au domaine ${title}.`}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Bibliothèque", href: "/bibliotheque" },
        { label: title },
      ]}
    >
      <div className="space-y-8">
        <LibrarySectionNav current="/bibliotheque" />
        {activities.length === 0 ? (
          <EmptyState
            title="Aucune activité dans ce domaine"
            description="Les activités publiées pour ce domaine apparaîtront ici."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <LibraryActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </PublicPageShell>
  );
}
