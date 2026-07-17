import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { EmptyState } from "@/components/shared/EmptyState";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteContainer } from "@/components/shared/SiteContainer";
import type { InterventionZone } from "@/lib/queries/home";

export function InterventionZones({ zones }: { zones: InterventionZone[] }) {
  return (
    <Section className="bg-[var(--afd-surface)]">
      <SiteContainer>
        <div className="grid gap-10 lg:grid-cols-12">
          <FadeIn className="lg:col-span-5">
            <SectionHeading
              eyebrow="Zones d’intervention"
              title="Présents en République démocratique du Congo"
              description="Les localités ci-dessous sont dérivées des projets publiés. Une carte SVG officielle de la RDC pourra être intégrée ultérieurement."
            />
            <Link
              href="/actions/zones-intervention"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-accent)]"
            >
              Voir nos zones d’intervention
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </FadeIn>

          <FadeIn delay={0.08} className="lg:col-span-7">
            {zones.length === 0 ? (
              <EmptyState
                title="Zones à renseigner"
                description="Aucune localisation de projet publiée pour le moment. Un espace carte RDC est réservé pour une future intégration SVG fiable."
              />
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {zones.map((zone) => (
                  <li
                    key={zone.label}
                    className="rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface-elevated)] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <MapPinned
                        className="mt-0.5 size-4 text-[var(--afd-accent)]"
                        aria-hidden
                      />
                      <div>
                        <h3 className="font-semibold text-[var(--afd-ink)]">
                          {zone.label}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--afd-muted)]">
                          {zone.projectCount} projet
                          {zone.projectCount > 1 ? "s" : ""}
                          {zone.beneficiaries != null && zone.beneficiaries > 0
                            ? ` · ${new Intl.NumberFormat("fr-FR").format(zone.beneficiaries)} bénéficiaires`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-xs text-[var(--afd-muted)]">
              Carte SVG RDC : non disponible — liste accessible utilisée à la
              place d’une fausse carte.
            </p>
          </FadeIn>
        </div>
      </SiteContainer>
    </Section>
  );
}
