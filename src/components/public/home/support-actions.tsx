import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  Handshake,
  Mail,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { homeContent } from "@/config/home-content";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  adhesion: UserPlus,
  partenaire: Handshake,
  soutenir: HeartHandshake,
  contact: Mail,
};

export function SupportActions() {
  return (
    <Section className="bg-white">
      <SiteContainer>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {homeContent.supportActions.map((action, index) => {
            const Icon = icons[action.id] ?? HeartHandshake;
            const featured = action.id === "soutenir";

            return (
              <FadeIn
                key={action.id}
                delay={index * 0.05}
                className={cn(
                  "flex h-full flex-col rounded-2xl border p-5",
                  featured
                    ? "border-[var(--afd-support)]/25 bg-[var(--afd-support)]/5"
                    : "border-[var(--afd-border)] bg-[var(--afd-surface)]/40",
                )}
              >
                <Icon className="size-6 text-[var(--afd-accent)]" aria-hidden />
                <h3 className="font-display mt-4 text-lg font-semibold text-[var(--afd-accent-strong)]">
                  {action.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--afd-muted)]">
                  {action.description}
                </p>
                {"note" in action && action.note ? (
                  <p className="mt-2 text-xs text-[var(--afd-muted)]">{action.note}</p>
                ) : null}
                <Link
                  href={action.href}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-accent)]"
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
