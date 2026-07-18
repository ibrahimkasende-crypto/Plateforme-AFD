import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { afdImages } from "@/config/afd-images";

const actions = [
  {
    title: "Activité communautaire",
    type: "Sensibilisation",
    image: afdImages.actionsTerrain[0],
    href: "/actions/projets",
  },
  {
    title: "Action de proximité",
    type: "Terrain",
    image: afdImages.actionsTerrain[1],
    href: "/actions/projets",
  },
  {
    title: "Rencontre associative",
    type: "Coordination",
    image: afdImages.actionsTerrain[2],
    href: "/actions/projets",
  },
] as const;

export function FieldActions() {
  const [primary, ...rest] = actions;

  return (
    <Section className="bg-[var(--afd-surface-elevated)]">
      <SiteContainer>
        <FadeIn>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="afd-label text-[var(--afd-blue)]">Terrain</p>
              <h2 className="afd-h2 mt-3">Nos actions sur le terrain</h2>
              <p className="mt-3 max-w-xl text-[15px] text-[var(--afd-muted)]">
                Illustrations d’activités AFD. Les localisations et dates
                précises seront affichées lorsqu’elles seront documentées.
              </p>
            </div>
            <Link
              href="/actions/projets"
              className="afd-btn-text inline-flex min-h-11 items-center gap-2 text-[var(--afd-blue)]"
            >
              Voir les projets
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </FadeIn>

        <div className="mt-8 grid gap-5 lg:grid-cols-12 lg:gap-6">
          <FadeIn className="lg:col-span-7">
            <article className="group overflow-hidden rounded-2xl border border-[var(--afd-border)] bg-white">
              <div className="relative aspect-[16/10]">
                <Image
                  src={primary.image.src}
                  alt={primary.image.alt}
                  fill
                  sizes="(max-width:1024px) 100vw, 60vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  style={{ objectPosition: primary.image.objectPosition }}
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold tracking-wide text-[var(--afd-blue)] uppercase">
                  {primary.type}
                </p>
                <h3 className="afd-h3 mt-1">{primary.title}</h3>
                <p className="mt-2 text-sm text-[var(--afd-muted)]">
                  Illustration d’une activité AFD
                </p>
              </div>
            </article>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {rest.map((action, index) => (
              <FadeIn key={action.title} delay={0.05 * (index + 1)}>
                <article className="group flex h-full overflow-hidden rounded-2xl border border-[var(--afd-border)] bg-white sm:flex-col lg:flex-row">
                  <div className="relative aspect-[16/10] w-full sm:aspect-[16/9] lg:aspect-auto lg:h-auto lg:w-36 lg:shrink-0">
                    <Image
                      src={action.image.src}
                      alt={action.image.alt}
                      fill
                      sizes="(max-width:1024px) 50vw, 160px"
                      className="object-cover"
                      style={{ objectPosition: action.image.objectPosition }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-4">
                    <p className="text-[11px] font-semibold tracking-wide text-[var(--afd-blue)] uppercase">
                      {action.type}
                    </p>
                    <h3 className="mt-1 font-semibold text-[var(--afd-ink)]">
                      {action.title}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--afd-muted)]">
                      Illustration d’une activité AFD
                    </p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </SiteContainer>
    </Section>
  );
}
