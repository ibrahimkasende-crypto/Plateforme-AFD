import Link from "next/link";
import { ArrowRight, HeartHandshake, Handshake, UserPlus } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { homeContent } from "@/config/home-content";
import { cn } from "@/lib/utils";

const icons = {
  adhesion: UserPlus,
  partenaire: Handshake,
  soutenir: HeartHandshake,
} as const;

export function SupportActions() {
  return (
    <Section className="bg-[var(--afd-surface)]">
      <SiteContainer>
        <FadeIn>
          <h2 className="font-display max-w-2xl text-3xl font-semibold tracking-tight text-[var(--afd-ink)] md:text-4xl">
            Agir avec l’AFD
          </h2>
          <p className="mt-3 max-w-2xl text-base text-[var(--afd-muted)]">
            Plusieurs façons de renforcer l’impact de l’Alliance des Femmes pour
            le Développement.
          </p>
        </FadeIn>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {homeContent.supportActions.map((action, index) => {
            const Icon = icons[action.id as keyof typeof icons] ?? HeartHandshake;
            const featured = action.id === "soutenir";

            return (
              <FadeIn
                key={action.id}
                delay={index * 0.06}
                className={cn(
                  "flex h-full flex-col rounded-2xl border p-6",
                  featured
                    ? "border-[var(--afd-support)]/30 bg-[var(--afd-support)] text-white"
                    : "border-[var(--afd-border)] bg-white",
                )}
              >
                <Icon
                  className={cn(
                    "size-6",
                    featured ? "text-white" : "text-[var(--afd-accent)]",
                  )}
                  aria-hidden
                />
                <h3
                  className={cn(
                    "font-display mt-4 text-xl font-semibold",
                    featured ? "text-white" : "text-[var(--afd-ink)]",
                  )}
                >
                  {action.title}
                </h3>
                <p
                  className={cn(
                    "mt-2 flex-1 text-sm leading-relaxed",
                    featured ? "text-white/85" : "text-[var(--afd-muted)]",
                  )}
                >
                  {action.description}
                </p>
                {"note" in action && action.note ? (
                  <p className="mt-3 text-xs text-white/75">{action.note}</p>
                ) : null}
                <Link
                  href={action.href}
                  className={cn(
                    "mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold transition duration-150",
                    featured
                      ? "text-white hover:text-white/90"
                      : "text-[var(--afd-accent)] hover:text-[var(--afd-accent-strong)]",
                  )}
                >
                  {action.cta}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </SiteContainer>
    </Section>
  );
}
