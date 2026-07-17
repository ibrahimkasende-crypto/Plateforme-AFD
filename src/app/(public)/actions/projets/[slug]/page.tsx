import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { siteConfig } from "@/config/site";
import { getProjectBySlug } from "@/lib/queries/public/projets";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Projet introuvable" };
  }

  const url = `${siteConfig.url}/actions/projets/${project.slug}`;

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      title: project.title,
      description: project.description,
      url,
      type: "article",
      images: project.image_url ? [{ url: project.image_url }] : undefined,
    },
  };
}

export default async function ProjetDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const startDate = formatDate(project.start_date);
  const endDate = formatDate(project.end_date);

  return (
    <PublicPageShell
      eyebrow="Projet"
      title={project.title}
      description={project.description}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Actions", href: "/actions" },
        { label: "Projets", href: "/actions/projets" },
        { label: project.title },
      ]}
    >
      {project.image_url ? (
        <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-2xl bg-[var(--afd-light-blue)]">
          <Image
            src={project.image_url}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 960px"
            className="object-cover"
          />
        </div>
      ) : null}

      <dl className="mb-8 grid gap-4 rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
            Localisation
          </dt>
          <dd className="mt-1 text-sm font-medium text-[var(--afd-ink)]">
            {project.location}
          </dd>
        </div>
        {project.status ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
              Statut
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--afd-ink)]">
              {project.status}
            </dd>
          </div>
        ) : null}
        {startDate ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
              Date de début
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--afd-ink)]">
              {startDate}
            </dd>
          </div>
        ) : null}
        {endDate ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
              Date de fin
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--afd-ink)]">
              {endDate}
            </dd>
          </div>
        ) : null}
        {project.beneficiaries != null && project.beneficiaries > 0 ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
              Bénéficiaires
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--afd-ink)]">
              {new Intl.NumberFormat("fr-FR").format(project.beneficiaries)}
            </dd>
          </div>
        ) : null}
        {project.programmeTitle && project.programmeSlug ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
              Programme
            </dt>
            <dd className="mt-1 text-sm font-medium">
              <Link
                href={`/actions/programmes/${project.programmeSlug}`}
                className="text-[var(--afd-blue)] hover:underline"
              >
                {project.programmeTitle}
              </Link>
            </dd>
          </div>
        ) : null}
      </dl>

      {project.results ? (
        <section className="mb-8">
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Résultats
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-[var(--afd-text)]">
            {project.results}
          </p>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-4">
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center rounded-lg bg-[var(--afd-blue)] px-5 text-sm font-semibold text-white"
        >
          Nous contacter
        </Link>
        <Link
          href="/soutenir"
          className="inline-flex min-h-11 items-center rounded-lg border border-[var(--afd-border)] px-5 text-sm font-semibold text-[var(--afd-ink)]"
        >
          Soutenir un projet
        </Link>
      </div>
    </PublicPageShell>
  );
}
