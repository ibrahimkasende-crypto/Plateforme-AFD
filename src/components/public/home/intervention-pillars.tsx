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
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--afd-accent)]">
            Priorités
          </p>
          <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-[var(--afd-accent-strong)] md:text-4xl">
            Nos domaines d’intervention
          </h2>
        </FadeIn>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {homeContent.pillars.map((pillar, index) => {
            const Icon = iconMap[pillar.icon] ?? HeartPulse;
            return (
              <FadeIn key={pillar.id} delay={index * 0.04}>
                <Link
                  href="/actions/domaines-intervention"
                  className="group block rounded-xl p-1 transition duration-200 hover:bg-[var(--afd-surface)]"
                >
                  <div className="inline-flex size-14 items-center justify-center rounded-full border border-[var(--afd-accent)]/25 bg-[var(--afd-accent-soft)] text-[var(--afd-accent)] transition duration-200 group-hover:border-[var(--afd-accent)]/50">
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <h3 className="font-display mt-4 text-lg font-semibold text-[var(--afd-accent-strong)]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--afd-muted)]">
                    {pillar.description}
                  </p>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <div className="mt-8">
          <Link
            href="/actions/domaines-intervention"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-accent)]"
          >
            Voir tous les domaines
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </SiteContainer>
    </Section>
  );
}
