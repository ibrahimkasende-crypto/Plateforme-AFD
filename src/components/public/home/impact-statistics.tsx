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
import { FadeIn } from "@/components/motion/FadeIn";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { homeContent } from "@/config/home-content";
import type { PublicImpactStats } from "@/lib/queries/home";
import { cn } from "@/lib/utils";

function AnimatedNumber({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

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

  return (
    <span ref={ref}>{new Intl.NumberFormat("fr-FR").format(display)}</span>
  );
}

const cards: {
  key: keyof PublicImpactStats;
  label: string;
  icon: LucideIcon;
}[] = [
  { key: "personnesAccompagnees", label: "Personnes accompagnées", icon: Users },
  { key: "projetsRealises", label: "Projets réalisés", icon: FolderKanban },
  { key: "provincesCouvertes", label: "Provinces d’intervention", icon: MapPinned },
  { key: "femmesAccompagnees", label: "Femmes et filles bénéficiaires", icon: UsersRound },
  { key: "partenairesActifs", label: "Partenaires actifs", icon: Handshake },
  { key: "activitesRealisees", label: "Activités réalisées", icon: Activity },
];

export function ImpactStatistics({ stats }: { stats: PublicImpactStats }) {
  const isDev = process.env.NODE_ENV === "development";
  const visibleCards = cards.filter((card) => {
    const value = stats[card.key];
    if (typeof value === "number") return true;
    return isDev;
  });

  if (visibleCards.length === 0) return null;

  return (
    <section
      aria-label="Chiffres clés"
      className="relative z-10 -mt-10 pb-2 md:-mt-14"
    >
      <SiteContainer>
        <FadeIn>
          <div className="rounded-[20px] border border-[var(--afd-border)] bg-white px-4 py-6 shadow-[0_14px_44px_rgba(16,35,63,0.1)] md:px-6 md:py-7">
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-6 xl:gap-0">
              {visibleCards.map((card, index) => {
                const value = stats[card.key];
                const numeric = typeof value === "number" ? value : null;
                const Icon = card.icon;

                return (
                  <div
                    key={card.key}
                    className={cn(
                      "flex flex-col items-start gap-2 px-3 py-1 md:px-4",
                      index > 0 &&
                        "xl:border-l xl:border-[var(--afd-border)]",
                    )}
                  >
                    <Icon
                      className="size-5 text-[var(--afd-blue)]"
                      aria-hidden
                    />
                    <p
                      className={cn(
                        "font-heading text-2xl font-extrabold tracking-tight text-[var(--afd-navy)] md:text-[1.65rem]",
                        numeric == null && "text-[var(--afd-muted)]",
                      )}
                    >
                      {numeric != null ? (
                        <AnimatedNumber value={numeric} />
                      ) : (
                        "À renseigner"
                      )}
                    </p>
                    <p className="max-w-[9.5rem] text-[13px] leading-snug text-[var(--afd-muted)]">
                      {card.label}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="mt-5 border-t border-[var(--afd-border)] pt-3 text-[11px] text-[var(--afd-muted)]">
              {homeContent.statsDisclaimer} Aucun chiffre inventé n’est affiché.
            </p>
          </div>
        </FadeIn>
      </SiteContainer>
    </section>
  );
}
