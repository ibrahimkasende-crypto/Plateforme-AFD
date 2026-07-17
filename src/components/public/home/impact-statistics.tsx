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
  { key: "femmesAccompagnees", label: "Femmes accompagnées", icon: UsersRound },
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
      className="relative z-10 -mt-8 pb-4 md:-mt-12"
    >
      <SiteContainer>
        <FadeIn>
          <div className="rounded-2xl border border-[var(--afd-border)] bg-white px-4 py-5 shadow-[0_10px_40px_rgba(15,39,68,0.08)] md:px-6 md:py-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {visibleCards.map((card) => {
                const value = stats[card.key];
                const numeric = typeof value === "number" ? value : null;
                const Icon = card.icon;

                return (
                  <div
                    key={card.key}
                    className="flex flex-col items-start gap-2 px-2 py-1"
                  >
                    <Icon
                      className="size-5 text-[var(--afd-accent)]"
                      aria-hidden
                    />
                    <p
                      className={cn(
                        "font-display text-2xl font-semibold text-[var(--afd-accent-strong)]",
                        numeric == null && "text-[var(--afd-muted)]",
                      )}
                    >
                      {numeric != null ? (
                        <AnimatedNumber value={numeric} />
                      ) : (
                        "À renseigner"
                      )}
                    </p>
                    <p className="text-xs leading-snug text-[var(--afd-muted)]">
                      {card.label}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 border-t border-[var(--afd-border)] pt-3 text-[11px] text-[var(--afd-muted)]">
              {homeContent.statsDisclaimer} Aucun chiffre inventé n’est affiché.
            </p>
          </div>
        </FadeIn>
      </SiteContainer>
    </section>
  );
}
