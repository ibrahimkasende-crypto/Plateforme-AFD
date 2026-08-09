import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LibraryActivityCard } from "@/components/public/bibliotheque/library-activity-card";
import { LibrarySectionNav } from "@/components/public/bibliotheque/library-section-nav";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import {
  getLibraryActivitiesByProvince,
  listLibraryProvinces,
} from "@/lib/queries/public/bibliotheque";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const provinces = await listLibraryProvinces();
  return provinces.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const provinces = await listLibraryProvinces();
  const province = provinces.find((p) => p.slug === slug);
  const title = province?.label ?? slug;
  return {
    title: `Bibliothèque — ${title}`,
    description: `Activités de l’AFD documentées en ${title}.`,
    alternates: {
      canonical: `${siteConfig.url}/bibliotheque/provinces/${slug}`,
    },
  };
}

export default async function BibliothequeProvincePage({ params }: PageProps) {
  const { slug } = await params;
  const [provinces, activities] = await Promise.all([
    listLibraryProvinces(),
    getLibraryActivitiesByProvince(slug),
  ]);
  const province = provinces.find((p) => p.slug === slug);
  if (!province && activities.length === 0) notFound();
  const title = province?.label ?? activities[0]?.province ?? slug;

  return (
    <PublicPageShell
      eyebrow="Bibliothèque · Province"
      title={title}
      description={`Carte documentaire des activités réalisées en ${title}.`}
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
            title="Aucune activité dans cette province"
            description="Les activités publiées pour cette province apparaîtront ici."
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
