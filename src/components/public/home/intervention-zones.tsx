import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DrcInteractiveMap } from "@/components/maps/drc-interactive-map";
import { FadeIn } from "@/components/motion/FadeIn";
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
        <FadeIn>
          <div className="max-w-2xl">
            <p className="afd-label text-[var(--afd-blue)]">
              Zones d’intervention
            </p>
            <h2 className="afd-h2 mt-3">
              Présents en République démocratique du Congo
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-[1.7] text-[var(--afd-muted)] md:text-base">
              Les 8 provinces où l’AFD est présente apparaissent en bleu. Survolez
              une zone pour afficher les données à côté de la carte.
            </p>
            <Link
              href="/actions/zones-intervention"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-accent)]"
            >
              Voir la carte interactive
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.06} className="mt-8 lg:mt-10">
          <DrcInteractiveMap bundle={bundle} variant="home" />
        </FadeIn>
      </SiteContainer>
    </Section>
  );
}
