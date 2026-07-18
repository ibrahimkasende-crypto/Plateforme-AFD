"use client";

import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";
import type { InterventionProvince } from "@/features/intervention-zones/types/intervention-zone";
import { cn } from "@/lib/utils";

export function ProvinceDetails({
  province,
  className,
  compact = false,
}: {
  province: InterventionProvince | null;
  className?: string;
  compact?: boolean;
}) {
  if (!province) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-dashed border-[var(--afd-border)] bg-white p-5",
          className,
        )}
      >
        <p className="text-sm text-[var(--afd-muted)]">
          Sélectionnez une province sur la carte ou dans la liste pour afficher
          ses données publiées.
        </p>
      </div>
    );
  }

  const format = new Intl.NumberFormat("fr-FR");

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--afd-border)] bg-white p-5 shadow-[0_8px_24px_rgba(3,27,60,0.06)]",
        className,
      )}
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--afd-blue)]/10 text-[var(--afd-blue)]">
          <MapPinned className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-wide text-[var(--afd-blue)] uppercase">
            Province
          </p>
          <h3 className="font-heading text-lg font-bold text-[var(--afd-navy)]">
            {province.name}
          </h3>
        </div>
      </div>

      {!province.active ? (
        <p className="mt-4 text-sm text-[var(--afd-muted)]">
          Aucune intervention publiée pour cette province.
        </p>
      ) : (
        <div className="mt-4 space-y-3 text-sm">
          <p className="text-[var(--afd-text)]">
            <span className="font-semibold">{province.projectCount}</span> projet
            {province.projectCount > 1 ? "s" : ""} publié
            {province.projectCount > 1 ? "s" : ""}
            {province.beneficiaries != null && province.beneficiaries > 0
              ? ` · ${format.format(province.beneficiaries)} bénéficiaires`
              : ""}
          </p>

          {province.sectors.length > 0 ? (
            <div>
              <p className="text-xs font-semibold tracking-wide text-[var(--afd-muted)] uppercase">
                Domaines / programmes
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {province.sectors.map((sector) => (
                  <li
                    key={sector}
                    className="rounded-md bg-[var(--afd-light-blue)] px-2 py-1 text-[12px] text-[var(--afd-navy)]"
                  >
                    {sector}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {!compact && province.projects.length > 0 ? (
            <div>
              <p className="text-xs font-semibold tracking-wide text-[var(--afd-muted)] uppercase">
                Projets associés
              </p>
              <ul className="mt-1.5 space-y-1">
                {province.projects.slice(0, 5).map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/actions/projets/${project.slug}`}
                      className="inline-flex items-center gap-1 text-[var(--afd-blue)] hover:underline"
                    >
                      {project.title}
                      <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      <Link
        href={province.href}
        className="afd-btn-text mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[var(--afd-blue)]"
      >
        Voir sur la page zones
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
