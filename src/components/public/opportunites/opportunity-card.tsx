import Link from "next/link";
import { ArrowRight, Briefcase, CalendarClock, MapPin } from "lucide-react";
import { CqCard } from "@/components/public/cards/cq-card";
import type { Opportunity } from "@/features/opportunites/types";
import { cn } from "@/lib/utils";

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export function OpportunityCard({
  opportunity,
  className,
}: {
  opportunity: Opportunity;
  className?: string;
}) {
  const deadline = formatDate(opportunity.date_limite);
  const typeLabel =
    opportunity.type === "emploi"
      ? "Emploi"
      : opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1);

  return (
    <CqCard
      as="article"
      className={cn(
        "group flex h-full flex-col rounded-[18px] border border-[var(--afd-border)] bg-white p-4 shadow-[0_10px_28px_rgba(6,38,83,0.05)] transition hover:border-[var(--afd-blue)]/30 hover:shadow-[0_14px_34px_rgba(6,38,83,0.08)] @min-[260px]/card:rounded-[20px] @min-[260px]/card:p-5 @min-[320px]/card:p-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--afd-blue)]/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-[var(--afd-blue)] uppercase">
          <Briefcase className="size-3.5" aria-hidden />
          {typeLabel}
        </span>
        {opportunity.statut === "bientot_cloturee" ? (
          <span className="rounded-md bg-[var(--afd-orange)]/15 px-2.5 py-1 text-[11px] font-bold text-[var(--afd-orange-hover)] uppercase">
            Bientôt clôturée
          </span>
        ) : null}
      </div>

      <h3 className="font-heading mt-3 text-lg font-extrabold leading-snug text-[var(--afd-navy)]">
        <Link
          href={`/ressources/opportunites/${opportunity.slug}`}
          className="transition hover:text-[var(--afd-blue)]"
        >
          {opportunity.titre}
        </Link>
      </h3>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-[var(--afd-muted)]">
        {opportunity.localisation ? (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5 text-[var(--afd-blue)]" aria-hidden />
            {opportunity.localisation}
          </span>
        ) : null}
        {opportunity.type_contrat ? (
          <span>{opportunity.type_contrat}</span>
        ) : null}
      </div>

      {deadline ? (
        <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--afd-orange-hover)]">
          <CalendarClock className="size-3.5" aria-hidden />
          Date limite : {deadline}
        </p>
      ) : null}

      <p className="mt-3 line-clamp-3 flex-1 text-[14px] leading-relaxed text-[var(--afd-muted)]">
        {opportunity.description}
      </p>

      <Link
        href={`/ressources/opportunites/${opportunity.slug}`}
        className="afd-btn-text mt-5 inline-flex min-h-11 items-center gap-2 text-[var(--afd-blue)]"
      >
        Voir l’offre
        <ArrowRight
          className="size-4 transition group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
    </CqCard>
  );
}
