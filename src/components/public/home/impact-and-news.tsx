import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { EmptyState } from "@/components/shared/EmptyState";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { afdImages } from "@/config/afd-images";
import type { FeaturedImpactStory, LatestNews } from "@/lib/queries/home";
import { cn } from "@/lib/utils";

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function ImpactAndNews({
  story,
  news,
}: {
  story: FeaturedImpactStory;
  news: LatestNews[];
}) {
  const isDev = process.env.NODE_ENV === "development";
  const showStory = Boolean(story) || isDev;

  return (
    <Section className="bg-[var(--afd-surface-elevated)]">
      <SiteContainer>
        <div
          className={cn(
            "grid gap-12 lg:gap-12",
            showStory ? "lg:grid-cols-12" : "lg:grid-cols-1",
          )}
        >
          {showStory ? (
            <div className="min-w-0 lg:col-span-5">
              <FadeIn>
                <div className="h-1 w-10 rounded-full bg-[var(--afd-blue)]" aria-hidden />
                <h2 className="afd-h2 mt-4">Histoire d’impact</h2>
              </FadeIn>
              <div className="mt-6">
                <ImpactStoryCard story={story} isDev={isDev} />
              </div>
              <Link
                href="/impact/histoires"
                className="afd-btn-text mt-5 inline-flex min-h-11 items-center gap-2 text-[var(--afd-blue)] lg:hidden"
              >
                Voir toutes les histoires
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          ) : null}

          <div className={cn("min-w-0", showStory && "lg:col-span-7")}>
            <FadeIn>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="h-1 w-10 rounded-full bg-[var(--afd-blue)]" aria-hidden />
                  <h2 className="afd-h2 mt-4">Actualités récentes</h2>
                </div>
                <Link
                  href="/actualites"
                  className="afd-btn-text hidden min-h-11 items-center gap-2 text-[var(--afd-blue)] sm:inline-flex"
                >
                  Voir toutes les actualités
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </FadeIn>

            <div className="mt-6">
              {news.length === 0 ? (
                <EmptyState
                  title="Aucune actualité publiée"
                  description="Les prochaines publications apparaîtront ici."
                />
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {news.slice(0, 3).map((item, index) => (
                    <FadeIn key={item.id} delay={0.04 * index} className="min-w-0">
                      <NewsCard item={item} />
                    </FadeIn>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/actualites"
              className="afd-btn-text mt-6 inline-flex min-h-11 items-center gap-2 text-[var(--afd-blue)] sm:hidden"
            >
              Voir toutes les actualités
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </SiteContainer>
    </Section>
  );
}

function ImpactStoryCard({
  story,
  isDev,
}: {
  story: FeaturedImpactStory;
  isDev: boolean;
}) {
  if (!story) {
    return (
      <FadeIn>
        <article className="flex w-full max-w-full flex-col overflow-hidden rounded-[16px] bg-[var(--afd-navy)] text-white sm:rounded-[20px]">
          <div className="relative aspect-[4/3] max-h-[280px] bg-[var(--afd-dark-navy)] sm:aspect-[4/5] sm:max-h-[420px]">
            <Image
              src={afdImages.histoireImpact.src}
              alt={afdImages.histoireImpact.alt}
              fill
              sizes="(max-width:1024px) 100vw, 40vw"
              className="object-cover"
              style={{ objectPosition: afdImages.histoireImpact.objectPosition }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--afd-navy)] via-[var(--afd-navy)]/40 to-transparent" />
          </div>
          <div className="space-y-3 p-5 sm:p-6 md:p-7">
            <p className="afd-label text-white/70">Histoire d’impact</p>
            <h3 className="font-heading text-lg font-bold leading-snug sm:text-xl">
              Parcours documentés à venir
            </h3>
            <p className="text-[15px] leading-relaxed text-white/85">
              Découvrez prochainement les parcours et transformations documentés
              dans le cadre des actions de l’AFD.
            </p>
            {isDev ? (
              <p className="text-xs text-white/55">
                Image illustrative — autorisation de publication à vérifier.
              </p>
            ) : null}
          </div>
        </article>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <article className="flex w-full max-w-full flex-col overflow-hidden rounded-[16px] bg-[var(--afd-navy)] text-white sm:rounded-[20px]">
        <div className="relative aspect-[4/3] max-h-[280px] bg-[var(--afd-dark-navy)] sm:aspect-[4/5] sm:max-h-[420px]">
          {story.imageUrl ? (
            <Image
              src={story.imageUrl}
              alt=""
              fill
              sizes="(max-width:1024px) 100vw, 40vw"
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--afd-navy)] via-[var(--afd-navy)]/40 to-transparent" />
        </div>
        <div className="space-y-3 p-5 sm:p-6 md:p-7">
          <p className="font-heading text-3xl leading-none text-white/35 sm:text-4xl" aria-hidden>
            “
          </p>
          <h3 className="font-heading text-lg font-bold leading-snug sm:text-xl">
            {story.title}
          </h3>
          <p className="text-[15px] leading-relaxed text-white/85">{story.excerpt}</p>
          {story.location ? (
            <p className="text-sm font-semibold text-white/70">{story.location}</p>
          ) : null}
          <Link
            href={story.href}
            className="afd-btn-text inline-flex min-h-11 items-center gap-2 text-white"
          >
            Lire l’histoire
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </article>
    </FadeIn>
  );
}

function NewsCard({ item }: { item: LatestNews }) {
  const dateLabel = formatDate(item.published_at);

  return (
    <Link
      href={`/actualites/${item.slug}`}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[16px] border border-[var(--afd-border)] bg-[var(--afd-background)] transition duration-180 hover:border-[var(--afd-blue)]/35 sm:rounded-[18px]"
    >
      <div className="relative aspect-[16/10] bg-[var(--afd-light-blue)]">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt=""
            fill
            sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--afd-muted)]">
            Image à venir
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-2 text-[12px] text-[var(--afd-muted)]">
          {item.category ? (
            <span className="font-bold text-[var(--afd-blue)]">{item.category}</span>
          ) : null}
          {dateLabel ? <span>{dateLabel}</span> : null}
        </div>
        <h3 className="afd-h3 mt-2 line-clamp-3 break-words">{item.title}</h3>
        <p className="mt-2 line-clamp-3 text-[13px] leading-[1.55] text-[var(--afd-muted)] sm:text-[14px]">
          {item.excerpt}
        </p>
        <span className="afd-btn-text mt-auto inline-flex min-h-10 items-center gap-2 pt-4 text-[var(--afd-blue)]">
          Lire la suite
          <ArrowRight className="size-3.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
