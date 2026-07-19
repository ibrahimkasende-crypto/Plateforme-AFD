import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DrcInteractiveMap } from "@/components/maps/drc-interactive-map";
import { AnimatedSection } from "@/components/motion/animated-section";
import { MotionHeading } from "@/components/motion/motion-heading";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import type { InterventionZonesBundle } from "@/features/intervention-zones/types/intervention-zone";

export function InterventionZones({
  bundle,
}: {
  bundle: InterventionZonesBundle;
}) {
  return (
    <Section className="bg-[var(--afd-surface)]">
      <SiteContainer>
        <AnimatedSection as="div" variant="slide-left">
          <div className="max-w-2xl">
            <p className="afd-label text-[var(--afd-blue)]">
              Zones d’intervention
            </p>
            <MotionHeading className="afd-h2 mt-3">
              Présents en République démocratique du Congo
            </MotionHeading>
            <p className="mt-3 max-w-xl text-[15px] leading-[1.7] text-[var(--afd-muted)] md:text-base">
              Les 8 provinces où l’AFD est présente apparaissent en bleu.{" "}
              <span className="md:hidden">
                Touchez une province pour afficher le détail sous la carte.
              </span>
              <span className="hidden md:inline">
                Survolez une zone pour afficher les données à côté de la carte.
              </span>
            </p>
            <Link
              href="/actions/zones-intervention"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-accent)]"
            >
              Voir la carte interactive
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </AnimatedSection>

        <AnimatedSection
          as="div"
          variant="soft-scale"
          delay={0.08}
          className="mt-8 lg:mt-10"
        >
          <DrcInteractiveMap bundle={bundle} variant="home" />
        </AnimatedSection>
      </SiteContainer>
    </Section>
  );
}
