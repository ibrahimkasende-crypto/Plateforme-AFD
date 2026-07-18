import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { HorizontalCardRail } from "@/components/mobile/horizontal-card-rail";
import { FadeIn } from "@/components/motion/FadeIn";
import { AdaptiveCard } from "@/components/responsive/adaptive-card";
import { ResponsiveSectionHeader } from "@/components/responsive/responsive-section-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import type { FeaturedProject } from "@/lib/queries/home";

export function FeaturedProjects({
  projects,
}: {
  projects: FeaturedProject[];
}) {
  return (
    <Section className="bg-[var(--afd-surface-elevated)]">
      <SiteContainer>
        <FadeIn>
          <ResponsiveSectionHeader
            eyebrow="Projets"
            title="Nos actions sur le terrain"
            description="Projets publiés et mis en avant par l’équipe AFD."
            href="/actions/projets"
            linkLabel="Découvrir tous les projets"
            linkPlacement="end"
          />
        </FadeIn>

        {projects.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Aucun projet publié pour le moment"
              description="Les projets actifs apparaîtront ici dès leur publication."
            />
          </div>
        ) : (
          <div className="mt-8 lg:mt-10">
            <HorizontalCardRail
              label="Projets mis en avant"
              featuredFirst
              desktopClassName="md:grid-cols-2 lg:grid-cols-3 md:gap-6"
              className="-mx-[var(--mobile-gutter)] md:mx-0"
            >
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </HorizontalCardRail>
          </div>
        )}
      </SiteContainer>
    </Section>
  );
}

function ProjectCard({ project }: { project: FeaturedProject }) {
  return (
    <Link href={`/actions/projets/${project.slug}`} className="block h-full">
      <AdaptiveCard
        stackOnly
        className="h-full transition duration-200 hover:border-[var(--afd-accent)]/40"
        media={
          <div className="relative aspect-[16/10] w-full bg-[var(--afd-accent-soft)]">
            {project.image_url ? (
              <Image
                src={project.image_url}
                alt=""
                fill
                sizes="(max-width:767px) 84vw, (max-width:1023px) 50vw, 33vw"
                className="object-cover transition duration-300 group-hover:scale-[1.025]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--afd-muted)]">
                Image à venir
              </div>
            )}
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--afd-muted)]">
          {project.programmeTitle ? (
            <span className="font-semibold text-[var(--afd-accent)]">
              {project.programmeTitle}
            </span>
          ) : null}
          {project.status ? <span>· {project.status}</span> : null}
        </div>
        <h3 className="font-display mt-2 text-[length:var(--text-card-title)] font-semibold text-[var(--afd-ink)]">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-[var(--afd-muted)]">
          {project.description}
        </p>
        {project.location ? (
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--afd-ink)]">
            <MapPin className="size-3.5 text-[var(--afd-accent)]" aria-hidden />
            {project.location}
          </p>
        ) : null}
        <span className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-accent)]">
          En savoir plus
          <ArrowRight className="size-4" aria-hidden />
        </span>
      </AdaptiveCard>
    </Link>
  );
}
