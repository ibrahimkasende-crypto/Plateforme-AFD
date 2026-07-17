import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { EmptyState } from "@/components/shared/EmptyState";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteContainer } from "@/components/shared/SiteContainer";
import type { LatestNews } from "@/lib/queries/home";
import { cn } from "@/lib/utils";

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function LatestNews({ news }: { news: LatestNews[] }) {
  const [primary, ...rest] = news;

  return (
    <Section className="bg-[var(--afd-surface-elevated)]">
      <SiteContainer>
        <FadeIn>
          <SectionHeading
            eyebrow="Actualités"
            title="Nos dernières actualités"
            description="Informations publiées par l’Alliance des Femmes pour le Développement."
          />
        </FadeIn>

        {news.length === 0 ? (
          <EmptyState
            title="Aucune actualité publiée"
            description="Les prochaines publications apparaîtront ici."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-5">
            {primary ? (
              <FadeIn className="lg:col-span-3">
                <NewsCard item={primary} featured />
              </FadeIn>
            ) : null}
            <div className="grid gap-4 lg:col-span-2">
              {rest.map((item, index) => (
                <FadeIn key={item.id} delay={0.05 * (index + 1)}>
                  <NewsCard item={item} />
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/actualites"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-accent)]"
          >
            Toutes les actualités
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </SiteContainer>
    </Section>
  );
}

function NewsCard({
  item,
  featured = false,
}: {
  item: LatestNews;
  featured?: boolean;
}) {
  const dateLabel = formatDate(item.published_at);

  return (
    <Link
      href={`/actualites/${item.slug}`}
      className={cn(
        "group flex h-full overflow-hidden rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] transition duration-200 hover:border-[var(--afd-accent)]/40",
        featured ? "flex-col" : "flex-col",
      )}
    >
      <div
        className={cn(
          "relative bg-[var(--afd-accent-soft)]",
          featured ? "aspect-[16/9]" : "aspect-[16/10]",
        )}
      >
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt=""
            fill
            sizes={featured ? "(max-width:1024px) 100vw, 60vw" : "40vw"}
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--afd-muted)]">
            Image à venir
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-2 text-xs text-[var(--afd-muted)]">
          {item.category ? (
            <span className="font-semibold text-[var(--afd-accent)]">
              {item.category}
            </span>
          ) : null}
          {dateLabel ? <span>{dateLabel}</span> : null}
        </div>
        <h3
          className={cn(
            "font-display mt-2 font-semibold text-[var(--afd-ink)]",
            featured ? "text-2xl" : "text-lg",
          )}
        >
          <span className="line-clamp-3">{item.title}</span>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-[var(--afd-muted)]">
          {item.excerpt}
        </p>
      </div>
    </Link>
  );
}
