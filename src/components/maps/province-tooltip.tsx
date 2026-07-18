"use client";

import type { InterventionProvince } from "@/features/intervention-zones/types/intervention-zone";
import { cn } from "@/lib/utils";

export function ProvinceTooltip({
  province,
  x,
  y,
  visible,
}: {
  province: InterventionProvince | null;
  x: number;
  y: number;
  visible: boolean;
}) {
  if (!province || !visible) return null;

  const format = new Intl.NumberFormat("fr-FR");

  return (
    <div
      role="tooltip"
      className={cn(
        "pointer-events-none fixed z-50 w-[min(260px,calc(100vw-24px))] rounded-xl border border-[var(--afd-border)] bg-white p-3 shadow-[0_10px_28px_rgba(3,27,60,0.14)] transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0",
      )}
      style={{
        left: `min(${x + 14}px, calc(100vw - 280px))`,
        top: Math.max(12, y - 12),
      }}
    >
      <p className="font-heading text-sm font-bold text-[var(--afd-navy)]">
        {province.name}
      </p>
      {province.mainLocality ? (
        <p className="mt-0.5 text-[12px] text-[var(--afd-muted)]">
          {province.mainLocality}
        </p>
      ) : null}
      {province.active ? (
        <ul className="mt-2 space-y-1 text-[12px] leading-snug text-[var(--afd-muted)]">
          <li>
            {province.projectCount} projet
            {province.projectCount > 1 ? "s" : ""}
          </li>
          {province.activityCount != null ? (
            <li>
              {province.activityCount} activité
              {province.activityCount > 1 ? "s" : ""}
            </li>
          ) : null}
          <li>
            {province.beneficiaries != null && province.beneficiaries > 0
              ? `${format.format(province.beneficiaries)} bénéficiaires`
              : "Bénéficiaires non renseignés"}
          </li>
          {province.sectors.length > 0 ? (
            <li className="line-clamp-2">
              Secteurs : {province.sectors.slice(0, 3).join(", ")}
            </li>
          ) : null}
          <li className="pt-1 font-medium text-[var(--afd-blue)]">
            Cliquez pour afficher le détail
          </li>
        </ul>
      ) : (
        <p className="mt-2 text-[12px] leading-snug text-[var(--afd-muted)]">
          Aucune intervention publiée
        </p>
      )}
    </div>
  );
}
