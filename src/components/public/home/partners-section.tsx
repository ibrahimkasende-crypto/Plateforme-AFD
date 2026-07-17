import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteContainer } from "@/components/shared/SiteContainer";
import type { ActivePartner } from "@/lib/queries/home";

export function PartnersSection({ partners }: { partners: ActivePartner[] }) {
  return (
    <Section className="bg-[var(--afd-surface)]">
      <SiteContainer>
        <FadeIn>
          <SectionHeading
            eyebrow="Partenaires"
            title="Ils nous accompagnent"
            description="Organisations enregistrées comme partenaires actifs de l’AFD."
            align="center"
          />
        </FadeIn>

        {partners.length === 0 ? (
          <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-[var(--afd-muted)]">
            L’AFD collabore avec des acteurs institutionnels, humanitaires et
            communautaires. La liste publique des partenaires sera affichée dès
            publication.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {partners.map((partner, index) => (
              <FadeIn
                key={partner.id}
                delay={index * 0.03}
                className="flex min-h-28 items-center justify-center rounded-2xl border border-[var(--afd-border)] bg-white p-4"
              >
                {partner.logo_url ? (
                  <Image
                    src={partner.logo_url}
                    alt={`Logo ${partner.name}`}
                    width={140}
                    height={64}
                    className="max-h-14 w-auto object-contain"
                  />
                ) : (
                  <span className="text-center text-sm font-medium text-[var(--afd-ink)]">
                    {partner.name}
                  </span>
                )}
              </FadeIn>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-accent)]"
          >
            Devenir partenaire
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </SiteContainer>
    </Section>
  );
}
