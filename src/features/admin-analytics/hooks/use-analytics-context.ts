"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { parseAnalyticsContext } from "@/features/admin-analytics/utils/analytics-search-params";
import type { AnalyticsContext } from "@/features/admin-analytics/types/admin-analytics";

export function useAnalyticsContext(
  initial?: AnalyticsContext,
): AnalyticsContext {
  const searchParams = useSearchParams();
  return useMemo(() => {
    const record: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      record[key] = value;
    });
    const parsed = parseAnalyticsContext(record);
    if (!initial) return parsed;
    return {
      dateStart: parsed.dateStart ?? initial.dateStart,
      dateEnd: parsed.dateEnd ?? initial.dateEnd,
      period: parsed.period ?? initial.period,
      programmeId: parsed.programmeId ?? initial.programmeId,
      projetId: parsed.projetId ?? initial.projetId,
      provinceId: parsed.provinceId ?? initial.provinceId,
      secteurId: parsed.secteurId ?? initial.secteurId,
      statut: parsed.statut ?? initial.statut,
      segment: parsed.segment ?? initial.segment,
      mois: parsed.mois ?? initial.mois,
      type: parsed.type ?? initial.type,
      vue: parsed.vue ?? initial.vue,
      sourceWidget: parsed.sourceWidget ?? initial.sourceWidget,
    };
  }, [searchParams, initial]);
}
