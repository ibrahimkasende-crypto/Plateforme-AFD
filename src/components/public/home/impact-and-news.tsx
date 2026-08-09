import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/motion/animated-section";
import { MotionHeading } from "@/components/motion/motion-heading";
import { ImpactImageBanner } from "@/components/public/home/impact-image-banner";
import { HomeNewsComposition } from "@/components/public/news/news-grid";
import { EmptyState } from "@/components/shared/EmptyState";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import type { FeaturedImpactStory } from "@/lib/queries/home";
import { getFeaturedNews } from "@/lib/queries/public/news";

export async function ImpactAndNews({
  story: _ignoredStory,
}: {
  story: FeaturedImpactStory;
  /** Conservé pour compatibilité avec l’appelant homepage. */
  news?: unknown;
}) {
  void _ignoredStory;
  const news = await getFeaturedNews(3);

  return (
    <Section className="bg-[var(--afd-surface-elevated)]">
      <SiteContainer>
        <AnimatedSection as="div" variant="fade-up">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="afd-label text-[var(--afd-blue)]">Actualités</p>
              <MotionHeading className="font-heading mt-3 text-[27px] font-extrabold leading-[1.15] text-[#062653] sm:text-[34px] lg:text-[40px]">
                Dernières nouvelles
              </MotionHeading>
              <p className="mt-2 max-w-2xl text-[15px] leading-[1.7] text-[#5F6F83]">
                Restez informés de nos actions sur le terrain
              </p>
            </div>
            <Link
              href="/actualites"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[var(--afd-blue)]/20 bg-white px-4 text-sm font-bold text-[var(--afd-blue)] transition hover:border-[var(--afd-orange)]/40 hover:text-[var(--afd-orange)]"
            >
              Tout voir
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </AnimatedSection>

        <AnimatedSection as="div" variant="soft-scale" delay={0.06} className="mt-8">
          {news.length === 0 ? (
            <EmptyState
              title="Aucune actualité publiée"
              description="Les prochaines publications apparaîtront ici."
            />
          ) : (
            <HomeNewsComposition items={news} />
          )}
        </AnimatedSection>

        <AnimatedSection as="div" variant="fade-up" delay={0.1}>
          <ImpactImageBanner />
        </AnimatedSection>
      </SiteContainer>
    </Section>
  );
}
