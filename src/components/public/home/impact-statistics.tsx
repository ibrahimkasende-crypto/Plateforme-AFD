"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import {
  Activity,
  FolderKanban,
  Handshake,
  MapPinned,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { HorizontalCardRail } from "@/components/mobile/horizontal-card-rail";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerContainer } from "@/components/motion/stagger-container";
import { StaggerItem } from "@/components/motion/stagger-item";
import { SiteContainer } from "@/components/shared/SiteContainer";
import {
  formatImpactStatValue,
  getImpactStatFormat,
} from "@/lib/format-impact-stat";
import type { PublicImpactStats } from "@/lib/queries/home";
import { cn } from "@/lib/utils";

function AnimatedNumber({
  value,
  formatKey,
}: {
  value: number;
  formatKey: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  const format = getImpactStatFormat(formatKey);

  useEffect(() => {
    if (!inView) return;

    if (reduceMotion) {
      const frame = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(frame);
    }

    const duration = 900;
    const start = performance.now();
    let frame = 0;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, value]);

  if (format === "plus-de") {
    return (
      <span ref={ref}>
        {inView ? formatImpactStatValue(formatKey, display || value) : "Plus de 0"}
      </span>
    );
  }

  if (format === "percent") {
    return (
      <span ref={ref}>
        {new Intl.NumberFormat("fr-FR").format(display)}&nbsp;%
      </span>
    );
  }

  return (
    <span ref={ref}>{new Intl.NumberFormat("fr-FR").format(display)}</span>
  );
}

const cards: {
  key: keyof Omit<PublicImpactStats, "source" | "missing">;
  label: string;
  icon: LucideIcon;
}[] = [
  { key: "personnesAccompagnees", label: "Personnes accompagnées", icon: Users },
  { key: "projetsRealises", label: "Projets réalisés", icon: FolderKanban },
  { key: "provincesCouvertes", label: "Provinces d’intervention", icon: MapPinned },
  {
    key: "femmesAccompagnees",
    label: "Femmes et jeunes filles bénéficiaires",
    icon: UsersRound,
  },
  { key: "partenairesActifs", label: "Partenaires actifs", icon: Handshake },
  { key: "activitesRealisees", label: "Activités réalisées", icon: Activity },
];

export function ImpactStatistics({ stats }: { stats: PublicImpactStats }) {
  const visibleCards = cards.filter((card) => typeof stats[card.key] === "number");

  if (visibleCards.length === 0) return null;

  return (
    <section
      aria-label="Chiffres clés"
      className="relative z-10 -mt-6 pb-2 sm:-mt-8 md:-mt-14"
    >
      <SiteContainer>
        <FadeIn>
          <div className="rounded-[16px] border border-[var(--afd-border)] bg-[var(--afd-surface-elevated)] px-3 py-5 shadow-[0_14px_44px_rgba(16,35,63,0.1)] sm:rounded-[20px] sm:px-4 sm:py-6 md:px-6 md:py-7">
            <StaggerContainer>
              <HorizontalCardRail
                label="Chiffres clés"
                desktopClassName="md:grid-cols-3 xl:grid-cols-6 xl:gap-0"
                itemClassName="w-[min(78vw,280px)] md:w-auto"
                className="-mx-3 md:mx-0"
              >
                {visibleCards.map((card, index) => {
                  const value = stats[card.key];
                  const numeric = typeof value === "number" ? value : null;
                  const Icon = card.icon;

                  return (
                    <StaggerItem key={card.key}>
                      <div
                        className={cn(
                          "flex h-full min-w-0 flex-col items-start gap-1.5 rounded-xl bg-[var(--afd-background)]/60 px-3.5 py-3.5 xl:rounded-none xl:bg-transparent xl:px-4 xl:py-1",
                          index > 0 && "xl:border-l xl:border-[var(--afd-border)]",
                        )}
                      >
                        <Icon
                          className="size-4 text-[var(--afd-blue)] sm:size-5"
                          aria-hidden
                        />
                        <p
                          className={cn(
                            "font-heading text-[22px] font-extrabold tracking-tight text-[var(--afd-navy)] sm:text-2xl md:text-[1.65rem]",
                            numeric == null && "text-[var(--afd-muted)]",
                            getImpactStatFormat(card.key) === "plus-de" &&
                              "text-[1.15rem] sm:text-[1.35rem] md:text-[1.4rem]",
                          )}
                        >
                          {numeric != null ? (
                            <AnimatedNumber value={numeric} formatKey={card.key} />
                          ) : (
                            "À renseigner"
                          )}
                        </p>
                        <p className="max-w-full text-[12px] leading-snug text-[var(--afd-muted)] sm:text-[13px]">
                          {card.label}
                        </p>
                      </div>
                    </StaggerItem>
                  );
                })}
              </HorizontalCardRail>
            </StaggerContainer>
          </div>
        </FadeIn>
      </SiteContainer>
    </section>
  );
}
