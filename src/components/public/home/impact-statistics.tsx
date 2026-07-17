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
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
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
  { key: "femmesAccompagnees", label: "Femmes accompagnées", icon: UsersRound },
  { key: "projetsRealises", label: "Projets réalisés", icon: FolderKanban },
  { key: "provincesCouvertes", label: "Provinces couvertes", icon: MapPinned },
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
    <Section className="bg-[var(--afd-accent-strong)] text-white">
      <SiteContainer>
        <FadeIn>
          <SectionHeading
            title="Notre impact en chiffres"
            description="Indicateurs issus des données publiées de la plateforme."
            className="[&_h2]:text-white [&_p]:text-white/75"
          />
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCards.map((card, index) => {
            const value = stats[card.key];
            const numeric = typeof value === "number" ? value : null;
            const Icon = card.icon;

            return (
              <FadeIn
                key={card.key}
                delay={index * 0.05}
                className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/70">{card.label}</p>
                    <p
                      className={cn(
                        "mt-2 font-display text-3xl font-semibold",
                        numeric == null && "text-white/55",
                      )}
                    >
                      {numeric != null ? (
                        <AnimatedNumber value={numeric} />
                      ) : (
                        "À renseigner"
                      )}
                    </p>
                  </div>
                  <Icon className="size-5 text-[var(--afd-gold)]" aria-hidden />
                </div>
              </FadeIn>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-white/60">{homeContent.statsDisclaimer}</p>
      </SiteContainer>
    </Section>
  );
}
