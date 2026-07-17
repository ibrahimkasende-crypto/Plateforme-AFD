import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PublicEntityCard } from "@/components/public/PublicEntityCard";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { siteConfig } from "@/config/site";
import {
  getProgramBySlug,
  getProjectsByProgramId,
} from "@/lib/queries/public/programmes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    return { title: "Programme introuvable" };
  }

  const url = `${siteConfig.url}/actions/programmes/${program.slug}`;

  return {
    title: program.title,
    description: program.description,
    alternates: { canonical: url },
    openGraph: {
      title: program.title,
      description: program.description,
      url,
      type: "article",
      images: program.image_url ? [{ url: program.image_url }] : undefined,
    },
  };
}

export default async function ProgrammeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) notFound();

  const relatedProjects = await getProjectsByProgramId(program.id);

  return (
    <PublicPageShell
      eyebrow="Programme"
      title={program.title}
      description={program.description}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Actions", href: "/actions" },
        { label: "Programmes", href: "/actions/programmes" },
        { label: program.title },
      ]}
    >
      {program.image_url ? (
        <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-2xl bg-[var(--afd-light-blue)]">
          <Image
            src={program.image_url}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 960px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="whitespace-pre-wrap text-base leading-relaxed text-[var(--afd-text)]">
        {program.long_description}
      </div>

      {relatedProjects.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-[var(--afd-ink)]">
            Projets associés
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProjects.map((project) => (
              <PublicEntityCard
                key={project.id}
                title={project.title}
                description={project.description}
                href={`/actions/projets/${project.slug}`}
                imageUrl={project.image_url}
                meta={project.location}
              />
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/actions/programmes"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-blue)]"
        >
          Retour aux programmes
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center rounded-lg bg-[var(--afd-blue)] px-5 text-sm font-semibold text-white"
        >
          Nous contacter
        </Link>
      </div>
    </PublicPageShell>
  );
}
