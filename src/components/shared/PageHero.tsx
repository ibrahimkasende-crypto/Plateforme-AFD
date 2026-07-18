import type { ReactNode } from "react";
import { SecondaryPageBack } from "@/components/public/secondary-page-back";
import { SiteContainer } from "./SiteContainer";
import { cn } from "@/lib/utils";

export function PageHero({
  title,
  description,
  eyebrow,
  actions,
  className,
  backHref = "/",
  backLabel = "Retour",
  showBack = false,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
  backHref?: string;
  backLabel?: string;
  /** Afficher le retour + cœur animé (pages secondaires publiques). */
  showBack?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border-b border-[var(--afd-border)] bg-[linear-gradient(135deg,#0f355f_0%,#1a4f8c_45%,#2563a8_100%)] text-white",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 40%), radial-gradient(circle at 80% 0%, rgba(212,175,55,0.25), transparent 35%)",
        }}
      />
      <SiteContainer className="relative py-14 md:py-20">
        {showBack ? (
          <SecondaryPageBack href={backHref} label={backLabel} variant="hero" />
        ) : null}
        {eyebrow ? (
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--afd-gold)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
            {description}
          </p>
        ) : null}
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </SiteContainer>
    </div>
  );
}
