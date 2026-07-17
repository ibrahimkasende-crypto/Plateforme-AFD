import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { EmptyState } from "@/components/shared/EmptyState";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteContainer } from "@/components/shared/SiteContainer";
import type { FeaturedProject } from "@/lib/queries/home";
import { cn } from "@/lib/utils";

export function FeaturedProjects({
  projects,
}: {
  projects: FeaturedProject[];
}) {
  const [primary, ...rest] = projects;

  return (
    <Section className="bg-[var(--afd-surface-elevated)]">
      <SiteContainer>
        <FadeIn>
          <SectionHeading
            eyebrow="Projets"
            title="Nos actions sur le terrain"
            description="Projets publiés et mis en avant par l’équipe AFD."
          />
        </FadeIn>

        {projects.length === 0 ? (
          <EmptyState
            title="Aucun projet publié pour le moment"
            description="Les projets actifs apparaîtront ici dès leur publication."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-5">
            {primary ? (
              <FadeIn className="lg:col-span-3">
                <ProjectCard project={primary} featured />
              </FadeIn>
            ) : null}
            <div className="grid gap-4 lg:col-span-2">
              {rest.map((project, index) => (
                <FadeIn key={project.id} delay={0.06 + index * 0.05}>
                  <ProjectCard project={project} />
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/actions/projets"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-accent)]"
          >
            Découvrir tous les projets
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </SiteContainer>
    </Section>
  );
}

function ProjectCard({
  project,
  featured = false,
}: {
  project: FeaturedProject;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/actions/projets/${project.slug}`}
      className={cn(
        "group flex h-full overflow-hidden rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] transition duration-200 hover:border-[var(--afd-accent)]/40",
        featured ? "flex-col" : "flex-col sm:flex-row lg:flex-col",
      )}
    >
      <div
        className={cn(
          "relative bg-[var(--afd-accent-soft)]",
          featured ? "aspect-[16/10]" : "aspect-[16/10] sm:w-40 sm:shrink-0 lg:w-auto",
        )}
      >
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt=""
            fill
            sizes={featured ? "(max-width:1024px) 100vw, 60vw" : "320px"}
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--afd-muted)]">
            Image à venir
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--afd-muted)]">
          {project.programmeTitle ? (
            <span className="font-semibold text-[var(--afd-accent)]">
              {project.programmeTitle}
            </span>
          ) : null}
          {project.status ? <span>· {project.status}</span> : null}
        </div>
        <h3
          className={cn(
            "font-display mt-2 font-semibold text-[var(--afd-ink)]",
            featured ? "text-2xl" : "text-lg",
          )}
        >
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-[var(--afd-muted)]">
          {project.description}
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--afd-ink)]">
          <MapPin className="size-3.5 text-[var(--afd-accent)]" aria-hidden />
          {project.location}
        </p>
      </div>
    </Link>
  );
}
