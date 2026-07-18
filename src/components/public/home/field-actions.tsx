import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HorizontalCardRail } from "@/components/mobile/horizontal-card-rail";
import { FadeIn } from "@/components/motion/FadeIn";
import { AdaptiveCard } from "@/components/responsive/adaptive-card";
import { ResponsiveSectionHeader } from "@/components/responsive/responsive-section-header";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { afdImages } from "@/config/afd-images";

const actions = [
  {
    title: "Activité communautaire",
    type: "Sensibilisation",
    summary: "Illustration d’une activité AFD auprès des communautés.",
    image: afdImages.actionsTerrain[0],
    href: "/actions/projets",
  },
  {
    title: "Action de proximité",
    type: "Terrain",
    summary: "Intervention de proximité au service des populations.",
    image: afdImages.actionsTerrain[1],
    href: "/actions/projets",
  },
  {
    title: "Rencontre associative",
    type: "Coordination",
    summary: "Coordination et dialogue avec les acteurs locaux.",
    image: afdImages.actionsTerrain[2],
    href: "/actions/projets",
  },
] as const;

export function FieldActions() {
  return (
    <Section className="bg-[var(--afd-surface-elevated)]">
      <SiteContainer>
        <FadeIn>
          <ResponsiveSectionHeader
            eyebrow="Terrain"
            title="Nos actions sur le terrain"
            description="Illustrations d’activités AFD. Les localisations et dates précises seront affichées lorsqu’elles seront documentées."
            href="/actions/projets"
            linkLabel="Voir les projets"
            linkPlacement="end"
          />
        </FadeIn>

        <div className="mt-8 lg:mt-10">
          <HorizontalCardRail
            label="Actions sur le terrain"
            featuredFirst
            itemWidth="w-[min(84vw,22.5rem)]"
            desktopClassName="md:grid-cols-2 lg:grid-cols-3 md:gap-6"
            className="-mx-[var(--mobile-gutter)] md:mx-0"
          >
            {actions.map((action) => (
              <AdaptiveCard
                key={action.title}
                stackOnly
                className="h-full border-[var(--afd-border)]"
                media={
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={action.image.src}
                      alt={action.image.alt}
                      fill
                      sizes="(max-width:767px) 84vw, (max-width:1023px) 50vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-[1.025]"
                      style={{ objectPosition: action.image.objectPosition }}
                    />
                  </div>
                }
              >
                <p className="text-xs font-semibold tracking-wide text-[var(--afd-blue)] uppercase">
                  {action.type}
                </p>
                <h3 className="afd-h3 mt-1">{action.title}</h3>
                <p className="mt-2 flex-1 text-sm text-[var(--afd-muted)]">
                  {action.summary}
                </p>
                <Link
                  href={action.href}
                  className="afd-btn-text mt-4 inline-flex min-h-11 items-center gap-2 text-[var(--afd-blue)]"
                >
                  Voir les projets
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </AdaptiveCard>
            ))}
          </HorizontalCardRail>
        </div>
      </SiteContainer>
    </Section>
  );
}
