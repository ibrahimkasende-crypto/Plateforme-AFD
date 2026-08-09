/**
 * Types d’agents AFD — source centrale (ne pas dupliquer dans les composants).
 */
export const employmentTypeCodes = [
  "employe_permanent",
  "employe_temporaire",
  "consultant",
  "volontaire",
  "stagiaire",
  "agent_terrain",
  "superviseur_terrain",
  "responsable_projet",
  "responsable_programme",
  "responsable_rh",
  "responsable_finance",
  "responsable_logistique",
  "responsable_meal",
  "responsable_communication",
  "administrateur_systeme",
  "auditeur",
  "partenaire_externe",
] as const;

export type EmploymentTypeCode = (typeof employmentTypeCodes)[number];

export const employmentTypeLabels: Record<EmploymentTypeCode, string> = {
  employe_permanent: "Employé permanent",
  employe_temporaire: "Employé temporaire",
  consultant: "Consultant",
  volontaire: "Volontaire",
  stagiaire: "Stagiaire",
  agent_terrain: "Agent terrain",
  superviseur_terrain: "Superviseur terrain",
  responsable_projet: "Responsable de projet",
  responsable_programme: "Responsable de programme",
  responsable_rh: "Responsable RH",
  responsable_finance: "Responsable finance",
  responsable_logistique: "Responsable logistique",
  responsable_meal: "Responsable MEAL",
  responsable_communication: "Responsable communication",
  administrateur_systeme: "Administrateur système",
  auditeur: "Auditeur",
  partenaire_externe: "Partenaire externe",
};

/** Rôles assignables par l’Administrateur principal (pas de super_admin). */
export const principalAssignableRoles = [
  "admin_module",
  "responsable",
  "responsable_module",
  "agent",
  "employe",
  "agent_terrain",
  "auditeur",
  "lecture_seule",
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
] as const;

/** Rôles équivalents à Administrateur principal (Direction / IT / legacy). */
export const PRINCIPAL_ROLE_CODES = [
  "admin_principal_direction",
  "admin_principal_it",
  "admin_principal",
  "administrateur",
] as const;

export const PRINCIPAL_DIRECTION_ROLE = "admin_principal_direction" as const;
export const PRINCIPAL_IT_ROLE = "admin_principal_it" as const;

export const AFD_HIERARCHY_ROLES = [
  "super_admin",
  "admin_principal_direction",
  "admin_principal_it",
  "admin_principal",
  "admin_module",
  "responsable",
  "agent",
  "agent_terrain",
  "auditeur",
  "lecture_seule",
] as const;
