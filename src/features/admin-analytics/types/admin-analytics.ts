export type AnalyticsSegment =
  | "total"
  | "femmes"
  | "hommes"
  | "enfants"
  | "jeunes";

export type AnalyticsContext = {
  dateStart: string | null;
  dateEnd: string | null;
  period: string | null;
  programmeId: string | null;
  projetId: string | null;
  provinceId: string | null;
  secteurId: string | null;
  statut: string | null;
  segment: AnalyticsSegment | null;
  mois: string | null;
  type: string | null;
  vue: string | null;
  sourceWidget: string | null;
};

export type AnalyticsNamedValue = {
  name: string;
  value: number;
  percent?: number;
};

export type AnalyticsSeriesPoint = {
  label: string;
  value: number;
  secondary?: number;
};

export type AnalyticsTableRow = {
  id: string;
  title: string;
  subtitle?: string | null;
  status?: string | null;
  location?: string | null;
  value?: number | null;
  href: string;
};

export type AnalyticsKpi = {
  label: string;
  value: number | null;
  formatted: string;
  variationPct: number | null;
};

export type AnalyticsPageData = {
  title: string;
  description: string;
  context: AnalyticsContext;
  primaryKpi: AnalyticsKpi;
  series: AnalyticsSeriesPoint[];
  byProgramme: AnalyticsNamedValue[];
  byProvince: AnalyticsNamedValue[];
  bySector: AnalyticsNamedValue[];
  byStatus: AnalyticsNamedValue[];
  table: AnalyticsTableRow[];
  createHref: string | null;
  exportFilename: string;
};
