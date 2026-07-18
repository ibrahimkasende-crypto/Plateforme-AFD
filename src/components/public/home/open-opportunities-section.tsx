import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HorizontalCardRail } from "@/components/mobile/horizontal-card-rail";
import { FadeIn } from "@/components/motion/FadeIn";
import { OpportunityCard } from "@/components/public/opportunites/opportunity-card";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { getPublishedOpportunities } from "@/lib/queries/public/opportunites";

export async function OpenOpportunitiesSection() {
  const result = await getPublishedOpportunities({
    statut: "ouverte",
    pageSize: 3,
  });

  const openItems = result.items.filter(
    (item) => item.statut === "ouverte" || item.statut === "bientot_cloturee",
  );

  if (openItems.length === 0) return null;

  return (
    <Section className="bg-[var(--afd-surface)]">
      <SiteContainer>
        <FadeIn>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="afd-label text-[var(--afd-blue)]">Opportunités</p>
              <h2 className="afd-h2 mt-3">Rejoignez l’équipe AFD</h2>
              <p className="mt-3 text-[15px] leading-[1.7] text-[var(--afd-muted)] md:text-base">
                Rejoignez une équipe engagée au service des communautés.
              </p>
            </div>
            <Link
              href="/ressources/opportunites"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold text-[var(--afd-blue)] transition hover:translate-x-0.5"
            >
              Voir toutes les opportunités
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </FadeIn>

        <div className="mt-8 lg:mt-10">
          <HorizontalCardRail
            label="Opportunités ouvertes"
            desktopClassName="md:grid-cols-2 lg:grid-cols-3 md:gap-5"
            className="-mx-4 md:mx-0"
          >
            {openItems.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </HorizontalCardRail>
        </div>
      </SiteContainer>
    </Section>
  );
}
