import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { siteConfig } from "@/config/site";
import { getNewsBySlug } from "@/lib/queries/public/actualites";
import { stripHtmlTags } from "@/lib/text/strip-html";

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
  const article = await getNewsBySlug(slug);

  if (!article) {
    return { title: "Actualité introuvable" };
  }

  const description = stripHtmlTags(article.excerpt);
  const url = `${siteConfig.url}/actualites/${article.slug}`;

  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description,
      url,
      type: "article",
      publishedTime: article.published_at ?? undefined,
      images: article.image_url ? [{ url: article.image_url }] : undefined,
    },
  };
}

export default async function ActualiteDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) notFound();

  const publishedDate = formatDate(article.published_at);
  const excerptText = stripHtmlTags(article.excerpt);
  const contentText = stripHtmlTags(article.content);

  return (
    <PublicPageShell
      eyebrow={article.category ?? "Actualité"}
      title={article.title}
      description={excerptText}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Actualités", href: "/actualites" },
        { label: article.title },
      ]}
    >
      <div className="mb-6 flex flex-wrap gap-4 text-sm text-[var(--afd-muted)]">
        {publishedDate ? <time dateTime={article.published_at ?? undefined}>{publishedDate}</time> : null}
        {article.author ? <span>Par {article.author}</span> : null}
      </div>

      {article.image_url ? (
        <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-2xl bg-[var(--afd-light-blue)]">
          <Image
            src={article.image_url}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 960px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="whitespace-pre-wrap text-base leading-relaxed text-[var(--afd-text)]">
        {contentText}
      </div>

      <div className="mt-10">
        <Link
          href="/actualites"
          className="text-sm font-semibold text-[var(--afd-blue)] hover:underline"
        >
          ← Retour aux actualités
        </Link>
      </div>
    </PublicPageShell>
  );
}
