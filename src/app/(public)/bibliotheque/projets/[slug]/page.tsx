import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LibraryActivityCard } from "@/components/public/bibliotheque/library-activity-card";
import { LibrarySectionNav } from "@/components/public/bibliotheque/library-section-nav";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import {
  getLibraryActivitiesByProject,
  listLibraryProjects,
} from "@/lib/queries/public/bibliotheque";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await listLibraryProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const projects = await listLibraryProjects();
  const project = projects.find((p) => p.slug === slug);
  const title = project?.label ?? slug;
  return {
    title: `Bibliothèque — Projet ${title}`,
    description: `Activités documentées pour le projet ${title}.`,
    alternates: {
      canonical: `${siteConfig.url}/bibliotheque/projets/${slug}`,
    },
  };
}

export default async function BibliothequeProjetPage({ params }: PageProps) {
  const { slug } = await params;
  const [projects, activities] = await Promise.all([
    listLibraryProjects(),
    getLibraryActivitiesByProject(slug),
  ]);
  const project = projects.find((p) => p.slug === slug);
  if (!project && activities.length === 0) notFound();
  const title = project?.label ?? activities[0]?.project ?? slug;

  return (
    <PublicPageShell
      eyebrow="Bibliothèque · Projet"
      title={title}
      description={`Documentation des activités liées au projet ${title}.`}
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
            title="Aucune activité pour ce projet"
            description="Les activités publiées associées à ce projet apparaîtront ici."
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
