export const roles = [
  "super_admin",
  "direction_generale",
  "secretariat",
  "charge_programmes",
  "coordination_urgences",
  "coordination_sante",
  "coordination_developpement",
  "coordination_meal",
  "logistique",
  "ressources_humaines",
  "finance",
  "communication",
  "lecture_partenaire",
] as const;

export type Role = (typeof roles)[number];

export const roleLabels: Record<Role, string> = {
  super_admin: "Super administrateur",
  direction_generale: "Direction générale",
  secretariat: "Secrétariat",
  charge_programmes: "Chargé(e) de programmes",
  coordination_urgences: "Coordination urgences",
  coordination_sante: "Coordination santé",
  coordination_developpement: "Coordination développement",
  coordination_meal: "Coordination MEAL",
  logistique: "Logistique",
  ressources_humaines: "Ressources humaines",
  finance: "Finance",
  communication: "Communication",
  lecture_partenaire: "Lecture partenaire",
};
