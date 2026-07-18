"use client";

import {
  useCallback,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useReducedMotion } from "motion/react";
import { RDC_MAP_VIEWBOX, RDC_PROVINCE_PATHS } from "@/features/intervention-zones/data/rdc-province-paths";
import type {
  InterventionProvince,
  InterventionZonesBundle,
} from "@/features/intervention-zones/types/intervention-zone";
import {
  intensityFill,
  intensityStroke,
} from "@/features/intervention-zones/utils/intensity";
import { ProvinceDetails } from "@/components/maps/province-details";
import { ProvinceList } from "@/components/maps/province-list";
import { cn } from "@/lib/utils";

export function DrcInteractiveMap({
  bundle,
  variant = "home",
  initialProvinceId = null,
  className,
}: {
  bundle: InterventionZonesBundle;
  variant?: "home" | "page";
  initialProvinceId?: string | null;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const descId = useId();

  const provincesById = useMemo(() => {
    const map = new Map<string, InterventionProvince>();
    for (const province of bundle.provinces) {
      map.set(province.id, province);
    }
    return map;
  }, [bundle.provinces]);

  const [userSelectedId, setUserSelectedId] = useState<string | null>(null);
  const selectedId = userSelectedId ?? initialProvinceId;
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const isCoarsePointer = useSyncExternalStore(
    subscribeCoarsePointer,
    getCoarsePointerSnapshot,
    () => false,
  );

  /** Priorité au survol pour le panneau latéral, sinon la sélection */
  const previewId = hoveredId ?? selectedId;
  const preview = previewId ? (provincesById.get(previewId) ?? null) : null;
  const panelMode =
    hoveredId != null ? "hover" : selectedId != null ? "selected" : "idle";

  const selectProvince = useCallback((id: string) => {
    setUserSelectedId(id);
  }, []);

  const onProvinceFocus = useCallback((id: string) => {
    setHoveredId(id);
  }, []);

  const onProvincePointerMove = useCallback(
    (id: string) => {
      if (isCoarsePointer) return;
      setHoveredId(id);
    },
    [isCoarsePointer],
  );

  const clearHover = useCallback(() => {
    setHoveredId(null);
  }, []);

  const format = new Intl.NumberFormat("fr-FR");
  const summaryText = `L’AFD intervient actuellement dans ${bundle.summary.activeProvinces} province${
    bundle.summary.activeProvinces > 1 ? "s" : ""
  } à travers ${bundle.summary.totalProjects} projet${
    bundle.summary.totalProjects > 1 ? "s" : ""
  } publié${bundle.summary.totalProjects > 1 ? "s" : ""}.`;

  return (
    <div
      className={cn("min-w-0", className)}
      data-disable-water-effect=""
    >
      <p id={descId} className="sr-only">
        {summaryText} Carte interactive des 26 provinces de la République
        démocratique du Congo. Utilisez Tab pour parcourir les provinces, Entrée
        ou Espace pour sélectionner.
      </p>

      <div
        className={cn(
          "grid gap-6",
          variant === "home"
            ? "lg:grid-cols-12 lg:items-start"
            : "lg:grid-cols-12 lg:gap-8",
        )}
      >
        <div
          className={cn(
            "min-w-0 rounded-2xl border border-[var(--afd-border)] bg-white p-3 sm:p-4",
            variant === "home" ? "lg:col-span-7" : "lg:col-span-7",
          )}
        >
          <svg
            viewBox={RDC_MAP_VIEWBOX}
            role="img"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className="mx-auto h-auto w-full max-w-[520px] select-none lg:max-w-none"
          >
            <title id={titleId}>
              Carte des provinces de la République démocratique du Congo
            </title>
            {RDC_PROVINCE_PATHS.map((path) => {
              const province = provincesById.get(path.id);
              if (!province) return null;
              const isSelected = selectedId === path.id;
              const isHovered = hoveredId === path.id;
              const fill = isSelected
                ? "#062653"
                : intensityFill(province.intensity);
              const stroke = intensityStroke(
                province.intensity,
                isSelected,
                isHovered,
              );
              const strokeWidth = isSelected
                ? 2.4
                : isHovered
                  ? 2
                  : province.active
                    ? 1.1
                    : 0.65;

              return (
                <path
                  key={path.id}
                  d={path.d}
                  id={path.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`${province.name}${
                    province.active
                      ? `, présence AFD, ${province.projectCount} projet${province.projectCount > 1 ? "s" : ""}`
                      : ", hors couverture AFD actuelle"
                  }`}
                  aria-pressed={isSelected}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  className={cn(
                    "outline-none focus-visible:stroke-[var(--afd-orange)] focus-visible:stroke-[2.4]",
                    "cursor-pointer",
                    !reduceMotion &&
                      "transition-[fill,stroke,stroke-width,transform,filter] duration-200",
                    !reduceMotion &&
                      isHovered &&
                      !isSelected &&
                      "translate-y-[-1px]",
                    province.active && !isSelected && "drop-shadow-sm",
                  )}
                  onPointerEnter={() => onProvincePointerMove(path.id)}
                  onPointerMove={() => onProvincePointerMove(path.id)}
                  onPointerLeave={clearHover}
                  onFocus={() => onProvinceFocus(path.id)}
                  onBlur={clearHover}
                  onClick={() => selectProvince(path.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selectProvince(path.id);
                    }
                  }}
                />
              );
            })}
          </svg>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-[var(--afd-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-sm bg-[var(--afd-blue)]"
                aria-hidden
              />
              Présence AFD (8 provinces)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-sm border border-[#b7c5d4] bg-[#edf1f5]"
                aria-hidden
              />
              Autres provinces
            </span>
          </div>
          <p className="mt-1.5 text-center text-[11px] text-[var(--afd-muted)]">
            Survolez une zone bleue pour voir les données à droite · Carte SVG —
            Simplemaps.com
          </p>
        </div>

        <div
          className={cn(
            "min-w-0 space-y-4",
            variant === "home" ? "lg:col-span-5" : "lg:col-span-5",
          )}
        >
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Provinces couvertes"
              value={String(bundle.summary.activeProvinces)}
            />
            <StatCard
              label="Projets publiés"
              value={String(bundle.summary.totalProjects)}
            />
            <StatCard
              label="Bénéficiaires"
              value={
                bundle.summary.totalBeneficiaries != null
                  ? format.format(bundle.summary.totalBeneficiaries)
                  : "—"
              }
            />
            <StatCard
              label="Domaines d’action"
              value={String(bundle.summary.totalSectors)}
            />
          </div>

          <p className="text-sm leading-relaxed text-[var(--afd-text)]" aria-live="polite">
            {summaryText}
          </p>

          {bundle.isDemo ? (
            <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-[13px] font-medium text-amber-900">
              Données de démonstration — ces valeurs ne sont pas des statistiques
              officielles de l’AFD.
            </p>
          ) : null}

          {!bundle.hasPublishedLocations && !bundle.isDemo ? (
            <p className="rounded-xl border border-[var(--afd-border)] bg-[var(--afd-light-blue)]/60 px-3 py-2.5 text-[13px] text-[var(--afd-muted)]">
              Les données d’intervention par province seront affichées dès leur
              publication par l’AFD.
            </p>
          ) : null}

          <ProvinceDetails
            province={preview}
            compact={variant === "home"}
            mode={panelMode}
            isDemo={bundle.isDemo}
          />

          <ProvinceList
            provinces={bundle.provinces}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onSelect={selectProvince}
            filter={variant === "home" ? "all" : "all"}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--afd-border)] bg-white p-3 sm:p-4">
      <p className="font-heading text-xl font-extrabold tracking-tight text-[var(--afd-navy)] sm:text-2xl">
        {value}
      </p>
      <p className="mt-1 text-[12px] leading-snug text-[var(--afd-muted)]">
        {label}
      </p>
    </div>
  );
}

function subscribeCoarsePointer(onStoreChange: () => void) {
  const media = window.matchMedia("(pointer: coarse)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getCoarsePointerSnapshot() {
  return window.matchMedia("(pointer: coarse)").matches;
}
