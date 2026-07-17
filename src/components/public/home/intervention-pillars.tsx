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
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { homeContent } from "@/config/home-content";
import { cn } from "@/lib/utils";

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
          <SectionHeading
            eyebrow="Domaines d’intervention"
            title="Six piliers pour accompagner les communautés"
            description="Les interventions de l’AFD sont regroupées autour de priorités humanitaires et de développement."
          />
        </FadeIn>

        <div className="grid gap-4 md:grid-cols-6">
          {homeContent.pillars.map((pillar, index) => {
            const Icon = iconMap[pillar.icon] ?? HeartPulse;
            return (
              <FadeIn
                key={pillar.id}
                delay={index * 0.04}
                className={cn(
                  "group rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-5 transition duration-200 hover:border-[var(--afd-accent)]/35 hover:bg-white",
                  pillar.featured
                    ? "md:col-span-3"
                    : "md:col-span-3 lg:col-span-2",
                )}
              >
                <div className="inline-flex size-10 items-center justify-center rounded-xl bg-white text-[var(--afd-accent)] ring-1 ring-[var(--afd-border)]">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="font-display mt-4 text-xl font-semibold text-[var(--afd-ink)]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--afd-muted)]">
                  {pillar.description}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {pillar.topics.map((topic) => (
                    <li
                      key={topic}
                      className="text-xs font-medium text-[var(--afd-ink)]/80"
                    >
                      · {topic}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            );
          })}
        </div>

        <div className="mt-8">
          <Link
            href="/actions/domaines-intervention"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-accent)]"
          >
            Voir les domaines d’intervention
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </SiteContainer>
    </Section>
  );
}
