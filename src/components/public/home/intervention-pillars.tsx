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
    <Section className="bg-[var(--afd-surface-elevated)]">
      <SiteContainer>
        <FadeIn>
          <div className="max-w-2xl">
            <p className="afd-label text-[var(--afd-blue)]">Actions</p>
            <h2 className="afd-h2 mt-3">Nos domaines d’intervention</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-[1.7] text-[var(--afd-muted)] md:text-base">
              Six piliers structurants pour accompagner les communautés avec
              clarté, proximité et impact mesurable.
            </p>
          </div>
        </FadeIn>

        <div className="mt-8 grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 min-[360px]:gap-4 lg:mt-10 lg:grid-cols-3 lg:gap-5">
          {homeContent.pillars.map((pillar, index) => {
            const Icon = iconMap[pillar.icon] ?? HeartPulse;
            return (
              <FadeIn key={pillar.id} delay={index * 0.03} className="h-full min-w-0">
                <Link
                  href="/actions/domaines-intervention"
                  className="group relative flex h-full min-h-0 flex-col overflow-hidden rounded-[16px] border border-[var(--afd-border)] bg-[var(--afd-background)] p-4 transition duration-200 hover:border-[var(--afd-blue)]/40 hover:shadow-[0_18px_40px_rgba(16,35,63,0.1)] sm:rounded-2xl sm:p-6 lg:hover:-translate-y-1"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[var(--afd-blue)] transition duration-300 group-hover:scale-x-100"
                    aria-hidden
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--afd-blue)]/10 text-[var(--afd-blue)] transition duration-200 group-hover:bg-[var(--afd-blue)] group-hover:text-white sm:size-12">
                      <Icon className="size-4 sm:size-5" aria-hidden />
                    </div>
                    <span className="font-heading text-xs font-bold tracking-wider text-[var(--afd-muted)]/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="afd-h3 mt-3 text-left text-[0.98rem] leading-snug sm:mt-5 sm:text-[1.05rem]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 line-clamp-4 flex-1 text-left text-[13px] leading-[1.65] text-[var(--afd-muted)] sm:mt-2.5 sm:text-[14px] sm:leading-[1.7]">
                    {pillar.description}
                  </p>
                  <div className="mt-4 hidden space-y-2 border-t border-[var(--afd-border)] pt-4 sm:block">
                    {pillar.topics.slice(0, 2).map((topic) => (
                      <p
                        key={topic}
                        className="text-[12.5px] leading-snug text-[var(--afd-text)]/80"
                      >
                        <span className="mr-1.5 text-[var(--afd-blue)]" aria-hidden>
                          ›
                        </span>
                        {topic}
                      </p>
                    ))}
                  </div>
                  <span className="mt-4 inline-flex min-h-10 items-center gap-1.5 text-[13px] font-bold text-[var(--afd-blue)] sm:mt-5">
                    Découvrir
                    <ArrowRight
                      className="size-3.5 transition group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <div className="mt-8 lg:mt-10">
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
