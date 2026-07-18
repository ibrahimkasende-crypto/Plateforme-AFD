import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { HomeNewsComposition } from "@/components/public/news/news-grid";
import { EmptyState } from "@/components/shared/EmptyState";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { afdImages } from "@/config/afd-images";
import type { FeaturedImpactStory } from "@/lib/queries/home";
import { getFeaturedNews } from "@/lib/queries/public/news";
import { cn } from "@/lib/utils";

export async function ImpactAndNews({
  story,
}: {
  story: FeaturedImpactStory;
  /** Conservé pour compatibilité avec l’appelant homepage (ignoré — source unique getFeaturedNews). */
  news?: unknown;
}) {
  const isDev = process.env.NODE_ENV === "development";
  const showStory = Boolean(story) || isDev;
  const news = await getFeaturedNews(3);

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
                <h2 className="font-heading mt-4 text-[27px] font-extrabold leading-[1.15] text-[#062653] sm:text-[34px]">
                  Histoire d’impact
                </h2>
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
                  <h2 className="font-heading mt-4 text-[27px] font-extrabold leading-[1.15] text-[#062653] sm:text-[34px] lg:text-[40px]">
                    Dernières actualités
                  </h2>
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
                <HomeNewsComposition items={news} />
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
