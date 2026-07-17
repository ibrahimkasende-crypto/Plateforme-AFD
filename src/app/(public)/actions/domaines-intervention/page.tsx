import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  HeartPulse,
  LifeBuoy,
  Shield,
  Sprout,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { homeContent } from "@/config/home-content";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Domaines d’intervention",
  description:
    "Les six piliers d’intervention de l’AFD : santé et WASH, protection, autonomisation économique, éducation, sécurité alimentaire et urgences.",
  alternates: { canonical: `${siteConfig.url}/actions/domaines-intervention` },
};

const iconMap: Record<string, LucideIcon> = {
  HeartPulse,
  Shield,
  Briefcase,
  GraduationCap,
  Sprout,
  LifeBuoy,
};

export default function DomainesInterventionPage() {
  const allTopics = homeContent.pillars.flatMap((pillar) => pillar.topics);

  return (
    <PublicPageShell
      eyebrow="Actions"
      title="Domaines d’intervention"
      description="L’AFD regroupe ses interventions autour de six piliers complémentaires, chacun couvrant plusieurs secteurs d’action."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Actions", href: "/actions" },
        { label: "Domaines d’intervention" },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {homeContent.pillars.map((pillar) => {
          const Icon = iconMap[pillar.icon] ?? HeartPulse;
          return (
            <article
              key={pillar.id}
              className="rounded-2xl border border-[var(--afd-border)] bg-white p-6"
            >
              <div className="flex items-start gap-4">
                <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--afd-blue)]/10 text-[var(--afd-blue)]">
                  <Icon className="size-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
                    {pillar.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--afd-muted)]">
                    {pillar.description}
                  </p>
                </div>
              </div>
              <ul className="mt-5 space-y-2 border-t border-[var(--afd-border)] pt-4">
                {pillar.topics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-start gap-2 text-sm text-[var(--afd-text)]"
                  >
                    <span className="mt-0.5 text-[var(--afd-blue)]" aria-hidden>
                      ›
                    </span>
                    {topic}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <section className="mt-10 rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-6">
        <h2 className="font-display text-lg font-semibold text-[var(--afd-ink)]">
          Vue d’ensemble des secteurs couverts
        </h2>
        <p className="mt-2 text-sm text-[var(--afd-muted)]">
          Les secteurs ci-dessous sont regroupés sous les piliers d’intervention
          de l’AFD. Ils orientent la conception et le suivi de nos programmes.
        </p>
        <ul className="mt-4 columns-1 gap-x-8 sm:columns-2 lg:columns-3">
          {allTopics.map((topic) => (
            <li key={topic} className="mb-2 text-sm text-[var(--afd-text)]">
              {topic}
            </li>
          ))}
        </ul>
        <Link
          href="/actions/programmes"
          className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-blue)]"
        >
          Voir les programmes associés
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>
    </PublicPageShell>
  );
}
