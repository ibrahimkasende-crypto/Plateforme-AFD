import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { siteConfig } from "@/config/site";
import { getImpactStoryBySlug } from "@/lib/queries/public/impact";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getImpactStoryBySlug(slug);
  if (!story) {
    return { title: "Histoire introuvable" };
  }
  return {
    title: story.seo_title || story.title,
    description: story.seo_description || story.excerpt || undefined,
    alternates: { canonical: `${siteConfig.url}/impact/histoires/${story.slug}` },
    openGraph: {
      title: story.seo_title || story.title,
      description: story.seo_description || story.excerpt || undefined,
      url: `${siteConfig.url}/impact/histoires/${story.slug}`,
      images: story.image_url ? [{ url: story.image_url }] : undefined,
    },
  };
}

export default async function HistoireDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const story = await getImpactStoryBySlug(slug);
  if (!story) notFound();

  const displayName = story.anonymized
    ? "Personne ou communauté anonymisée"
    : story.person_or_community;

  return (
    <PublicPageShell
      eyebrow="Histoires d’impact"
      title={story.title}
      description={story.excerpt ?? undefined}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Impact", href: "/impact" },
        { label: "Histoires", href: "/impact/histoires" },
        { label: story.title },
      ]}
    >
      <article className="mx-auto max-w-3xl space-y-8">
        {story.image_url ? (
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[var(--afd-surface)]">
            <Image
              src={story.image_url}
              alt={story.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3 text-sm text-[var(--afd-muted)]">
          {story.location ? <span>{story.location}</span> : null}
          {displayName ? <span>· {displayName}</span> : null}
        </div>

        {story.quote ? (
          <blockquote className="border-l-4 border-[var(--afd-blue)] pl-4 text-lg italic text-[var(--afd-ink)]">
            {story.quote}
          </blockquote>
        ) : null}

        {story.content ? (
          <div className="prose prose-neutral max-w-none whitespace-pre-wrap text-[var(--afd-ink)]">
            {story.content}
          </div>
        ) : null}

        {story.results ? (
          <section className="rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-5">
            <h2 className="mb-2 text-lg font-semibold">Résultats observés</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--afd-muted)]">
              {story.results}
            </p>
          </section>
        ) : null}

        <Link
          href="/impact/histoires"
          className="inline-flex text-sm font-semibold text-[var(--afd-blue)]"
        >
          ← Retour aux histoires
        </Link>
      </article>
    </PublicPageShell>
  );
}
