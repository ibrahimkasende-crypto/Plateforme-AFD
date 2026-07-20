"use client";

import type { InterventionProvince } from "@/features/intervention-zones/types/intervention-zone";
import { cn } from "@/lib/utils";

type ProvinceTooltipProps = {
  province: InterventionProvince | null;
  visible: boolean;
  /** Style dashboard : fond noir arrondi */
  variant?: "light" | "dark";
  className?: string;
  /** Position absolute relative au conteneur carte (dark) ou fixed (light) */
  x?: number;
  y?: number;
};

export function ProvinceTooltip({
  province,
  visible,
  variant = "dark",
  className,
  x,
  y,
}: ProvinceTooltipProps) {
  if (!province || !visible) return null;

  const format = new Intl.NumberFormat("fr-FR");
  const isDark = variant === "dark";

  return (
    <div
      role="tooltip"
      className={cn(
        "pointer-events-none z-20 max-w-[min(220px,calc(100%-1rem))] rounded-xl px-3 py-2.5 text-[11px] shadow-[0_12px_28px_rgba(15,23,42,0.45)] transition-opacity duration-200",
        isDark
          ? "absolute left-2 top-2 border border-slate-600/60 bg-slate-900 text-slate-100"
          : "fixed border border-[var(--afd-border)] bg-white text-[var(--afd-navy)]",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
      style={
        !isDark && x != null && y != null
          ? {
              left: `min(${x + 14}px, calc(100vw - 280px))`,
              top: Math.max(12, y - 12),
            }
          : undefined
      }
    >
      <p
        className={cn(
          "font-semibold leading-snug",
          isDark ? "text-white" : "font-heading text-sm text-[var(--afd-navy)]",
        )}
      >
        {province.name}
      </p>
      {province.mainLocality ? (
        <p
          className={cn(
            "mt-0.5",
            isDark ? "text-slate-400" : "text-[12px] text-[var(--afd-muted)]",
          )}
        >
          {province.mainLocality}
        </p>
      ) : null}

      {province.active ? (
        <ul
          className={cn(
            "mt-1.5 space-y-0.5 leading-snug",
            isDark ? "text-slate-300" : "text-[12px] text-[var(--afd-muted)]",
          )}
        >
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
              {province.sectors.slice(0, 3).join(", ")}
            </li>
          ) : null}
        </ul>
      ) : (
        <p
          className={cn(
            "mt-1.5 leading-snug",
            isDark ? "text-slate-400" : "text-[12px] text-[var(--afd-muted)]",
          )}
        >
          Aucune intervention publiée
        </p>
      )}
    </div>
  );
}
