"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import type { ActivePartner } from "@/lib/queries/home";
import { cn } from "@/lib/utils";

function PartnerSlide({ partner }: { partner: ActivePartner }) {
  return (
    <div className="flex h-20 w-[160px] shrink-0 items-center justify-center px-3">
      {partner.logo_url ? (
        <Image
          src={partner.logo_url}
          alt={`Logo ${partner.name}`}
          width={140}
          height={56}
          className="max-h-12 w-auto object-contain opacity-80 transition duration-200 hover:opacity-100"
        />
      ) : (
        <span className="text-center text-sm font-semibold text-[var(--afd-navy)]/70">
          {partner.name}
        </span>
      )}
    </div>
  );
}

function PartnersMarquee({ partners }: { partners: ActivePartner[] }) {
  const loop = [...partners, ...partners];

  return (
    <div className="relative overflow-hidden py-2">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--afd-background)] to-transparent sm:w-24"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--afd-background)] to-transparent sm:w-24"
        aria-hidden
      />
      <div className="afd-partners-track flex w-max gap-8">
        {loop.map((partner, index) => (
          <PartnerSlide key={`${partner.id}-${index}`} partner={partner} />
        ))}
      </div>
    </div>
  );
}

export function PartnersSection({ partners }: { partners: ActivePartner[] }) {
  return (
    <Section className="overflow-hidden bg-[var(--afd-background)]">
      <SiteContainer>
        <FadeIn>
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <div className="mx-auto h-1 w-10 rounded-full bg-[var(--afd-blue)]" aria-hidden />
            <h2 className="afd-h2 mt-4">Ils nous accompagnent</h2>
            <p className="mt-3 text-sm text-[var(--afd-muted)] md:text-base">
              Organisations enregistrées comme partenaires actifs de l’AFD.
            </p>
          </div>
        </FadeIn>
      </SiteContainer>

      {partners.length === 0 ? (
        <div className="relative overflow-hidden py-2">
          <div className="afd-partners-track flex w-max gap-10 px-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="flex h-16 w-[180px] shrink-0 items-center justify-center px-3"
              >
                <span className="text-center text-[12px] font-semibold text-[var(--afd-muted)]/70">
                  Logos partenaires à publier
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={cn(partners.length < 4 && "md:px-[10%]")}>
          <PartnersMarquee partners={partners} />
        </div>
      )}

      <SiteContainer>
        <div className="mt-8 flex justify-center">
          <Link
            href="/contact"
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
