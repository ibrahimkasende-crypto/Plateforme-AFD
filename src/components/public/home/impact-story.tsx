import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import type { FeaturedImpactStory } from "@/lib/queries/home";

export function ImpactStory({ story }: { story: FeaturedImpactStory }) {
  const isDev = process.env.NODE_ENV === "development";

  if (!story && !isDev) return null;

  if (!story) {
    return (
      <Section className="bg-[var(--afd-surface-elevated)]">
        <SiteContainer>
          <div className="rounded-2xl border border-dashed border-[var(--afd-border)] bg-[var(--afd-surface)] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-accent)]">
              Développement
            </p>
            <h2 className="font-display mt-2 text-2xl font-semibold text-[var(--afd-ink)]">
              Histoire d’impact — placeholder
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--afd-muted)]">
              Aucune histoire d’impact publiée n’est encore disponible. Cette
              section est masquée en production tant qu’aucune donnée réelle
              n’existe.
            </p>
          </div>
        </SiteContainer>
      </Section>
    );
  }

  return (
    <Section className="bg-[var(--afd-surface-elevated)]">
      <SiteContainer>
        <FadeIn>
          {/* Mobile : carte verticale ; desktop : split horizontal */}
          <article className="grid overflow-hidden rounded-[18px] border border-[var(--afd-border)] bg-white shadow-[0_10px_32px_rgba(6,38,83,0.06)] lg:grid-cols-2 lg:rounded-2xl">
            <div className="relative aspect-[4/3] bg-[var(--afd-accent-soft)] sm:aspect-[4/5] lg:aspect-auto lg:min-h-[22rem]">
              {story.imageUrl ? (
                <Image
                  src={story.imageUrl}
                  alt=""
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover object-[50%_30%]"
                />
              ) : null}
            </div>
            <div className="flex flex-col justify-center p-5 sm:p-8 md:p-10">
              <p className="afd-label text-[var(--afd-accent)]">
                Histoire d’impact
              </p>
              <h2 className="afd-h2 mt-3">{story.title}</h2>
              <p className="mt-4 text-[length:var(--text-body)] leading-relaxed text-[var(--afd-muted)] text-pretty">
                {story.excerpt}
              </p>
              {story.location ? (
                <p className="mt-3 text-sm font-medium text-[var(--afd-ink)]">
                  {story.location}
                </p>
              ) : null}
              <Link
                href={story.href}
                className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-accent)]"
              >
                Lire l’histoire
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </article>
        </FadeIn>
      </SiteContainer>
    </Section>
  );
}
