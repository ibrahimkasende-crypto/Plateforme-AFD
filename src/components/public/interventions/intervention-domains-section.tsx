"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { InterventionDomainCard } from "@/components/public/interventions/intervention-domain-card";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import type { InterventionDomain } from "@/config/intervention-domains";

function useIsMobileAccordion(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

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
  const isMobile = useIsMobileAccordion();
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const body = (
    <>
        {!hideHeader ? (
          <FadeIn>
            <div className="max-w-2xl">
              <p className="afd-label text-[var(--afd-blue)]">Actions</p>
              <h2 className="font-heading mt-3 text-[27px] font-extrabold leading-[1.15] text-[#062653] sm:text-[34px] lg:text-[40px]">
                Nos domaines d’intervention
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-[1.7] text-[#5F6F83] md:text-base">
                Six axes structurants pour accompagner les communautés avec
                clarté, proximité et responsabilité.
              </p>
            </div>
          </FadeIn>
        ) : null}

        <div className={hideHeader ? "grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-7" : "mt-8 grid grid-cols-1 gap-5 md:mt-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-7"}>
          {domains.map((domain, index) => (
            <FadeIn key={domain.id} delay={index * 0.03} className="h-full min-w-0">
              {isMobile ? (
                <InterventionDomainCard
                  domain={domain}
                  index={index}
                  open={openSlug === domain.slug}
                  onOpenChange={(next) =>
                    setOpenSlug(next ? domain.slug : null)
                  }
                />
              ) : (
                <InterventionDomainCard
                  domain={domain}
                  index={index}
                  uncontrolled
                />
              )}
            </FadeIn>
          ))}
        </div>

        {showPageLink ? (
          <div className="mt-8 lg:mt-10">
            <Link
              href="/actions/domaines-intervention"
              className="afd-btn-text inline-flex min-h-11 items-center gap-2 text-[var(--afd-blue)] hover:text-[var(--afd-blue-hover)]"
            >
              Voir tous les domaines
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
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
