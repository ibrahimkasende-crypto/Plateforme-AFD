export const reportTypes = [
  { id: "activite", label: "Rapport d’activité" },
  { id: "financier", label: "Rapport financier" },
  { id: "meal", label: "Rapport MEAL" },
  { id: "impact", label: "Rapport d’impact" },
  { id: "urgence", label: "Rapport d’urgence" },
  { id: "partenariat", label: "Rapport partenaire" },
  { id: "newsletter", label: "Rapport newsletter" },
  { id: "custom", label: "Rapport personnalisé" },
] as const;

export type ReportTypeId = (typeof reportTypes)[number]["id"];
