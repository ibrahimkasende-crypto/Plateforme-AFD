export const projectStatuses = [
  { id: "draft", label: "Brouillon", tone: "neutral" },
  { id: "planned", label: "Planifié", tone: "info" },
  { id: "active", label: "Actif", tone: "success" },
  { id: "on_hold", label: "En pause", tone: "warning" },
  { id: "completed", label: "Terminé", tone: "success" },
  { id: "cancelled", label: "Annulé", tone: "danger" },
] as const;

export type ProjectStatusId = (typeof projectStatuses)[number]["id"];
