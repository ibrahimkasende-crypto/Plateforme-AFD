export const sectors = [
  { id: "urgences", label: "Urgences humanitaires" },
  { id: "developpement", label: "Développement" },
  { id: "sante", label: "Santé" },
  { id: "nutrition", label: "Nutrition" },
  { id: "wash", label: "WASH" },
  { id: "protection", label: "Protection" },
  { id: "autonomisation", label: "Autonomisation économique" },
  { id: "education", label: "Éducation" },
  { id: "securite_alimentaire", label: "Sécurité alimentaire" },
  { id: "cohesion_sociale", label: "Cohésion sociale" },
  { id: "leadership_feminin", label: "Leadership féminin" },
] as const;

export type SectorId = (typeof sectors)[number]["id"];
