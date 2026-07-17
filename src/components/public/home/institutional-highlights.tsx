import {
  HandHeart,
  HeartHandshake,
  RefreshCw,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { homeContent } from "@/config/home-content";

const iconMap: Record<string, LucideIcon> = {
  HeartHandshake,
  ShieldCheck,
  Users,
  RefreshCw,
  HandHeart,
};

export function InstitutionalHighlights() {
  return (
    <Section className="border-y border-[var(--afd-border)] bg-[var(--afd-light-blue)] py-12 md:py-14">
      <SiteContainer>
        <FadeIn>
          <p className="afd-label mb-6 text-[var(--afd-blue)]">Nos valeurs</p>
        </FadeIn>
        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-5">
          {homeContent.values.map((value, index) => {
            const Icon = iconMap[value.icon] ?? HeartHandshake;
            return (
              <FadeIn
                key={value.id}
                delay={index * 0.05}
                className="border-[var(--afd-border)] py-4 sm:px-4 lg:border-r lg:px-5 lg:py-0 lg:last:border-r-0"
              >
                <div className="flex items-start gap-3 lg:flex-col lg:gap-3">
                  <Icon
                    className="size-5 shrink-0 text-[var(--afd-blue)]"
                    aria-hidden
                  />
                  <div>
                    <h3 className="afd-h3">{value.title}</h3>
                    <p className="mt-1 text-[14px] leading-[1.6] text-[var(--afd-muted)]">
                      {value.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </SiteContainer>
    </Section>
  );
}
