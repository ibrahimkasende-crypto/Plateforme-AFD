import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReadingProgress } from "@/components/public/news/reading-progress";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { siteConfig } from "@/config/site";
import { getFeaturedNews, getNewsBySlug } from "@/lib/queries/public/news";
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

function estimateReadingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function renderContentBlocks(content: string) {
  const blocks = content.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return blocks.map((block, index) => {
    if (block.startsWith("## ")) {
      return (
        <h2
          key={`h-${index}`}
          className="font-heading mt-8 text-[1.15rem] font-bold text-[#062653] sm:text-[1.25rem]"
        >
          {block.replace(/^##\s+/, "")}
        </h2>
      );
    }

    if (block.startsWith("- ")) {
      const items = block
        .split("\n")
        .map((line) => line.replace(/^-\s+/, "").trim())
        .filter(Boolean);
      return (
        <ul key={`ul-${index}`} className="mt-4 list-disc space-y-2 pl-5">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={`p-${index}`} className="mt-4">
        {block}
      </p>
    );
  });
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
  const readingMinutes = estimateReadingMinutes(`${excerptText} ${contentText}`);
  const related = (await getFeaturedNews(4)).filter((item) => item.slug !== article.slug).slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: excerptText,
    image: article.image_url ? [article.image_url] : undefined,
    datePublished: article.published_at ?? undefined,
    author: article.author
      ? { "@type": "Person", name: article.author }
      : { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logo.src}`,
      },
    },
    mainEntityOfPage: `${siteConfig.url}/actualites/${article.slug}`,
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
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
        <div className="mb-6 flex flex-wrap gap-4 text-[13px] font-semibold tracking-[0.04em] text-[var(--afd-muted)]">
          {article.category ? (
            <span className="text-[var(--afd-blue)]">{article.category}</span>
          ) : null}
          {publishedDate ? (
            <time dateTime={article.published_at ?? undefined}>{publishedDate}</time>
          ) : null}
          {article.author ? <span>Par {article.author}</span> : null}
          <span>{readingMinutes} min de lecture</span>
        </div>

        {article.image_url ? (
          <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-[20px] bg-[var(--afd-light-blue)]">
            <Image
              src={article.image_url}
              alt={`Illustration de l’actualité : ${article.title}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 960px"
              className="object-cover"
            />
          </div>
        ) : null}

        <article
          id="article-content"
          className="mx-auto max-w-[760px] text-[17px] leading-[1.8] text-[var(--afd-text)] sm:text-[18px]"
        >
          <p className="font-heading text-[1.05rem] font-bold leading-snug text-[#062653] sm:text-[1.15rem]">
            {excerptText}
          </p>
          <div className="mt-2">{renderContentBlocks(article.content)}</div>
        </article>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${siteConfig.url}/actualites/${article.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-xl border border-[var(--afd-border)] px-4 text-sm font-semibold text-[var(--afd-blue)]"
          >
            Partager
          </a>
          <Link
            href="/actualites"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--afd-blue)] hover:underline"
          >
            ← Retour aux actualités
          </Link>
        </div>

        {related.length > 0 ? (
          <section className="mt-14">
            <h2 className="font-heading text-xl font-extrabold text-[#062653]">
              Actualités similaires
            </h2>
            <ul className="mt-4 space-y-3">
              {related.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/actualites/${item.slug}`}
                    className="text-sm font-semibold text-[var(--afd-blue)] hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </PublicPageShell>
    </>
  );
}
