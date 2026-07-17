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
    <Section className="bg-white">
      <SiteContainer>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {homeContent.supportActions.map((action, index) => {
            const Icon = icons[action.id] ?? Heart;
            const featured = action.id === "soutenir";

            return (
              <FadeIn
                key={action.id}
                delay={index * 0.05}
                className={cn(
                  "flex h-full flex-col rounded-[18px] border p-6",
                  featured
                    ? "border-[var(--afd-orange)]/30 bg-[var(--afd-orange)]/[0.06]"
                    : "border-[var(--afd-border)] bg-[var(--afd-background)]",
                )}
              >
                <Icon
                  className={cn(
                    "size-6 text-[var(--afd-blue)]",
                    featured && "fill-[var(--afd-orange)] text-[var(--afd-orange)]",
                  )}
                  aria-hidden
                />
                <h3 className="afd-h3 mt-4">{action.title}</h3>
                <p className="mt-2 flex-1 text-[14px] leading-[1.6] text-[var(--afd-muted)]">
                  {action.description}
                </p>
                {"note" in action && action.note ? (
                  <p className="mt-2 text-xs text-[var(--afd-muted)]">{action.note}</p>
                ) : null}
                <Link
                  href={action.href}
                  className="afd-btn-text mt-5 inline-flex min-h-11 items-center gap-2 text-[var(--afd-blue)]"
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
