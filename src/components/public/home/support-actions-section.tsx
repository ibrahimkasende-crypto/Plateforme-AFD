import Link from "next/link";
import { ArrowRight, Handshake, HeartHandshake, Mail, UsersRound } from "lucide-react";
import { HorizontalCardRail } from "@/components/mobile/horizontal-card-rail";
import { FadeIn } from "@/components/motion/FadeIn";
import { CqCard } from "@/components/public/cards/cq-card";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { homeContent } from "@/config/home-content";

const icons = {
  adhesion: UsersRound,
  partenaire: Handshake,
  soutenir: HeartHandshake,
  contact: Mail,
} as const;

export function SupportActionsSection() {
  const actions = homeContent.supportActions;

  return (
    <Section className="bg-[var(--afd-surface-elevated)]">
      <SiteContainer>
        <FadeIn>
          <div className="max-w-2xl">
            <p className="afd-label text-[var(--afd-blue)]">S’engager</p>
            <h2 className="afd-h2 mt-3">Agir avec l’AFD</h2>
            <p className="mt-3 text-[15px] leading-[1.7] text-[var(--afd-muted)] md:text-base">
              Plusieurs façons de soutenir les femmes, les jeunes et les
              communautés accompagnées par l’AFD.
            </p>
          </div>
        </FadeIn>

        <div className="mt-8 lg:mt-10">
          <HorizontalCardRail
            label="Actions d’engagement"
            desktopClassName="md:grid-cols-2 xl:grid-cols-4 md:gap-5"
            itemClassName="w-[min(84vw,320px)] md:w-auto"
            className="-mx-4 md:mx-0"
          >
            {actions.map((action) => {
              const Icon = icons[action.id as keyof typeof icons] ?? Handshake;

              return (
                <CqCard key={action.id} as="article" className="h-full">
                  <div className="flex h-full flex-col rounded-[18px] border border-[var(--afd-border)] bg-white p-5 shadow-[0_8px_24px_rgba(6,38,83,0.04)] @min-[260px]/card:p-6">
                    <span
                      className="inline-flex size-11 items-center justify-center rounded-xl bg-[var(--afd-blue)]/10 text-[var(--afd-blue)]"
                      aria-hidden
                    >
                      <Icon className="size-5" />
                    </span>
                    <h3 className="font-heading mt-4 text-[1.05rem] font-extrabold text-[var(--afd-navy)] @min-[280px]/card:text-[1.125rem]">
                      {action.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[var(--afd-muted)]">
                      {action.description}
                    </p>
                    <Link
                      href={action.href}
                      className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--afd-blue)] transition hover:gap-2.5"
                    >
                      {action.cta}
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </CqCard>
              );
            })}
          </HorizontalCardRail>
        </div>
      </SiteContainer>
    </Section>
  );
}
