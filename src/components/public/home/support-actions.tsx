import Link from "next/link";
import {
  ArrowRight,
  Heart,
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
  soutenir: Heart,
  contact: Mail,
};

export function SupportActions() {
  return (
    <Section className="bg-[var(--afd-surface-elevated)]">
      <SiteContainer>
        <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 min-[360px]:gap-5 lg:grid-cols-4 lg:gap-7">
          {homeContent.supportActions.map((action, index) => {
            const Icon = icons[action.id] ?? Heart;
            const featured = action.id === "soutenir";

            return (
              <FadeIn
                key={action.id}
                delay={index * 0.04}
                className="min-w-0"
              >
                <Link
                  href={action.href}
                  className={cn(
                    "group flex h-full min-h-[11rem] flex-col rounded-[16px] border p-5 transition duration-180 sm:rounded-[18px] sm:p-6",
                    featured
                      ? "border-[var(--afd-orange)]/30 bg-[var(--afd-orange)]/[0.06]"
                      : "border-[var(--afd-border)] bg-[var(--afd-background)] hover:border-[var(--afd-blue)]/30",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-6 text-[var(--afd-blue)]",
                      featured && "fill-[var(--afd-orange)] text-[var(--afd-orange)]",
                    )}
                    aria-hidden
                  />
                  <h3 className="afd-h3 mt-4 break-words">{action.title}</h3>
                  <p className="mt-2 flex-1 text-[14px] leading-[1.6] text-[var(--afd-muted)]">
                    {action.description}
                  </p>
                  {"note" in action && action.note ? (
                    <p className="mt-2 text-xs text-[var(--afd-muted)]">{action.note}</p>
                  ) : null}
                  <span className="afd-btn-text mt-5 inline-flex min-h-11 items-center gap-2 text-[var(--afd-blue)]">
                    {action.cta}
                    <ArrowRight
                      className="size-4 transition group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </SiteContainer>
    </Section>
  );
}
