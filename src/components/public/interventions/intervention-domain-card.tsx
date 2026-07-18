"use client";

import { useId, useState } from "react";
import {
  Briefcase,
  ChevronDown,
  Droplets,
  GraduationCap,
  HeartPulse,
  LifeBuoy,
  Shield,
  type LucideIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { InterventionDomainContent } from "@/components/public/interventions/intervention-domain-content";
import type { InterventionDomain } from "@/config/intervention-domains";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  HeartPulse,
  Shield,
  Briefcase,
  GraduationCap,
  Droplets,
  LifeBuoy,
};

type Props = {
  domain: InterventionDomain;
  index: number;
  /** Sur mobile : un seul domaine ouvert à la fois. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  uncontrolled?: boolean;
};

export function InterventionDomainCard({
  domain,
  index,
  open: controlledOpen,
  onOpenChange,
  uncontrolled = false,
}: Props) {
  const reactId = useId();
  const contentId = `domain-content-${domain.slug}-${reactId}`;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = uncontrolled ? internalOpen : Boolean(controlledOpen);
  const setOpen = uncontrolled
    ? setInternalOpen
    : (value: boolean) => onOpenChange?.(value);

  const Icon = iconMap[domain.icon] ?? HeartPulse;
  const numberLabel = String(index + 1).padStart(2, "0");

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="h-full">
      <article
        className={cn(
          "flex h-full flex-col rounded-[20px] border bg-white p-6 shadow-[0_8px_28px_rgba(6,38,83,0.04)] transition-[border-color,box-shadow] duration-250 sm:p-7 md:p-8",
          open
            ? "border-[var(--afd-blue)]/45 shadow-[0_12px_32px_rgba(6,38,83,0.08)]"
            : "border-[var(--afd-blue)]/15",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--afd-blue)]/10 text-[var(--afd-blue)]">
            <Icon className="size-5" aria-hidden />
          </div>
          <span
            className="font-heading text-sm font-bold tracking-[0.08em] text-[#062653]/35"
            aria-hidden
          >
            {numberLabel}
          </span>
        </div>

        <h3 className="font-heading mt-5 text-[19px] font-extrabold leading-[1.25] text-[#062653] sm:text-[21px]">
          {domain.title}
        </h3>

        <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-[1.7] text-[#5F6F83] sm:text-[16px]">
          {domain.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {domain.keywords.slice(0, 3).map((keyword) => (
            <span
              key={keyword}
              className="rounded-md bg-[var(--afd-blue)]/6 px-2.5 py-1 text-[12px] font-semibold tracking-wide text-[var(--afd-blue)]"
            >
              {keyword}
            </span>
          ))}
        </div>

        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="afd-btn-secondary mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--afd-blue)]/20 bg-[var(--afd-blue)]/5 px-4 text-sm font-bold text-[var(--afd-blue)] transition duration-200 hover:border-[var(--afd-orange)]/40 hover:bg-[var(--afd-orange)]/10 hover:text-[var(--afd-orange)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--afd-blue)] sm:w-auto"
            aria-expanded={open}
            aria-controls={contentId}
          >
            {open ? "Réduire" : "Lire la suite"}
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-250 motion-reduce:transition-none",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent
          id={contentId}
          className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
        >
          <div className="pt-2">
            <InterventionDomainContent domain={domain} />
          </div>
        </CollapsibleContent>
      </article>
    </Collapsible>
  );
}
