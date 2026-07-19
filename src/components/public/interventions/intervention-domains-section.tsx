import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HorizontalCardRail } from "@/components/mobile/horizontal-card-rail";
import { AnimatedSection } from "@/components/motion/animated-section";
import { MotionHeading } from "@/components/motion/motion-heading";
import { StaggerContainer } from "@/components/motion/stagger-container";
import { StaggerItem } from "@/components/motion/stagger-item";
import { InterventionDomainCard } from "@/components/public/interventions/intervention-domain-card";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import type { InterventionDomain } from "@/config/intervention-domains";

export function InterventionDomainsSection({
  domains,
  showPageLink = true,
  hideHeader = false,
  bare = false,
}: {
  domains: InterventionDomain[];
  showPageLink?: boolean;
  hideHeader?: boolean;
  /** Sans Section/SiteContainer (page déjà encapsulée). */
  bare?: boolean;
}) {
  const body = (
    <>
      {!hideHeader ? (
        <AnimatedSection as="div" variant="mask-up">
          <div className="max-w-2xl">
            <p className="afd-label text-[var(--afd-blue)]">Actions</p>
            <MotionHeading className="font-heading mt-3 text-[27px] font-extrabold leading-[1.15] text-[#062653] sm:text-[34px] lg:text-[40px]">
              Nos domaines d’intervention
            </MotionHeading>
            <p className="mt-3 max-w-xl text-[15px] leading-[1.7] text-[#5F6F83] md:text-base">
              Six axes structurants pour accompagner les communautés avec
              clarté, proximité et responsabilité.
            </p>
          </div>
        </AnimatedSection>
      ) : null}

      <div className={hideHeader ? undefined : "mt-8 md:mt-10"}>
        <StaggerContainer>
          <HorizontalCardRail
            label="Domaines d’intervention"
            desktopClassName="md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-7"
            className="-mx-4 md:mx-0"
          >
            {domains.map((domain, index) => (
              <StaggerItem key={domain.id} className="h-full min-w-0">
                <InterventionDomainCard domain={domain} index={index} />
              </StaggerItem>
            ))}
          </HorizontalCardRail>
        </StaggerContainer>
      </div>

      {showPageLink ? (
        <AnimatedSection as="div" variant="fade-up" delay={0.1} className="mt-8 lg:mt-10">
          <Link
            href="/actions/domaines-intervention"
            className="afd-btn-text inline-flex min-h-11 items-center gap-2 text-[var(--afd-blue)] transition hover:translate-x-0.5 hover:text-[var(--afd-blue-hover)]"
          >
            Voir tous les domaines
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </AnimatedSection>
      ) : null}
    </>
  );

  if (bare) {
    return <div>{body}</div>;
  }

  return (
    <Section className="bg-white">
      <SiteContainer>{body}</SiteContainer>
    </Section>
  );
}
