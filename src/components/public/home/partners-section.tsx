import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PartnersGrid } from "@/components/public/partners/partners-grid";
import { FadeIn } from "@/components/motion/FadeIn";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import type { PublicPartner } from "@/lib/queries/partenaires";

export function PartnersSection({ partners }: { partners: PublicPartner[] }) {
  return (
    <Section className="bg-white">
      <SiteContainer>
        <FadeIn>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--afd-blue)]">
              Ils nous font confiance
            </p>
            <h2 className="afd-h2 mt-3">Nos partenaires</h2>
            <p className="mt-3 text-sm text-[var(--afd-muted)] md:text-base">
              Organisations partenaires de l’Alliance des Femmes pour le
              Développement.
            </p>
          </div>
        </FadeIn>

        <PartnersGrid partners={partners} />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
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
        </div>
      </SiteContainer>
    </Section>
  );
}
