import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/motion/animated-section";
import { MotionHeading } from "@/components/motion/motion-heading";
import { PartnersGrid } from "@/components/public/partners/partners-grid";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import type { PublicPartner } from "@/lib/queries/partenaires";

export function PartnersSection({ partners }: { partners: PublicPartner[] }) {
  return (
    <Section className="bg-white">
      <SiteContainer>
        <AnimatedSection as="div" variant="fade-up">
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--afd-blue)]">
              Ils nous font confiance
            </p>
            <MotionHeading className="afd-h2 mt-3">Nos partenaires</MotionHeading>
            <p className="mt-3 text-sm text-[var(--afd-muted)] md:text-base">
              Institutions et organisations qui accompagnent l’Alliance des
              Femmes pour le Développement.
            </p>
          </div>
        </AnimatedSection>
      </SiteContainer>

      <AnimatedSection as="div" variant="soft-scale" delay={0.06} className="w-full py-2">
        <PartnersGrid partners={partners} autoScroll size="lg" />
      </AnimatedSection>

      <SiteContainer>
        <AnimatedSection
          as="div"
          variant="fade-up"
          delay={0.1}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 md:mt-12"
        >
          <Link
            href="/partenaires"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-navy)]"
          >
            Voir tous les partenaires
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="/partenariat"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-blue)]"
          >
            Devenir partenaire
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </AnimatedSection>
      </SiteContainer>
    </Section>
  );
}
