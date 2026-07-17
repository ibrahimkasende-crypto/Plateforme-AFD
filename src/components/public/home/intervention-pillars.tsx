import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  HeartPulse,
  LifeBuoy,
  Shield,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { homeContent } from "@/config/home-content";

const iconMap: Record<string, LucideIcon> = {
  HeartPulse,
  Shield,
  Briefcase,
  GraduationCap,
  Sprout,
  LifeBuoy,
};

export function InterventionPillars() {
  return (
    <Section className="bg-white">
      <SiteContainer>
        <FadeIn>
          <div className="h-1 w-10 rounded-full bg-[var(--afd-blue)]" aria-hidden />
          <h2 className="afd-h2 mt-4">Nos domaines d’intervention</h2>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-6 xl:gap-6">
          {homeContent.pillars.map((pillar, index) => {
            const Icon = iconMap[pillar.icon] ?? HeartPulse;
            return (
              <FadeIn key={pillar.id} delay={index * 0.04}>
                <Link
                  href="/actions/domaines-intervention"
                  className="group flex h-full flex-col items-start rounded-xl p-1 transition duration-180 hover:bg-[var(--afd-light-blue)]/60"
                >
                  <div className="inline-flex size-14 items-center justify-center rounded-full border border-[var(--afd-blue)]/20 bg-[var(--afd-light-blue)] text-[var(--afd-blue)] transition duration-180 group-hover:border-[var(--afd-blue)]/40">
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <h3 className="afd-h3 mt-4">{pillar.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.6] text-[var(--afd-muted)]">
                    {pillar.description}
                  </p>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <div className="mt-10">
          <Link
            href="/actions/domaines-intervention"
            className="afd-btn-text inline-flex min-h-11 items-center gap-2 text-[var(--afd-blue)] hover:text-[var(--afd-blue-hover)]"
          >
            Voir tous les domaines
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </SiteContainer>
    </Section>
  );
}
