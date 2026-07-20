import { roles, type Role } from "@/config/roles";

const LEGACY_ROLE_MAP: Record<string, Role> = {
  platform_owner: "platform_owner",
  platform_admin: "platform_admin",
  support_agent: "support_agent",
  billing_admin: "billing_admin",
  tenant_owner: "tenant_owner",
  tenant_super_admin: "tenant_super_admin",
  super_admin: "super_admin",
  administrateur: "administrateur",
  responsable_module: "responsable_module",
  direction_generale: "direction_generale",
  secretariat: "secretariat",
  charge_programmes: "charge_programmes",
  coordination_urgences: "coordination_urgences",
  coordination_sante: "coordination_sante",
  coordination_developpement: "coordination_developpement",
  coordination_meal: "coordination_meal",
  logistique: "logistique",
  ressources_humaines: "ressources_humaines",
  finance: "finance",
  communication: "communication",
  employe: "employe",
  agent_terrain: "agent_terrain",
  auditeur: "auditeur",
  partenaire_lecture: "partenaire_lecture",
  lecture_partenaire: "partenaire_lecture",
  utilisateur_public: "utilisateur_public",
  // Rôles historiques migration 20260715
  editeur: "charge_programmes",
  suivi_evaluation: "coordination_meal",
  finance_lecture: "finance",
};

const ROLE_RANK: Record<Role, number> = {
  platform_owner: 1000,
  platform_admin: 950,
  support_agent: 920,
  billing_admin: 910,
  tenant_owner: 905,
  tenant_super_admin: 902,
  super_admin: 900,
  administrateur: 800,
  responsable_module: 700,
  direction_generale: 90,
  charge_programmes: 80,
  coordination_meal: 75,
  coordination_urgences: 70,
  coordination_sante: 70,
  coordination_developpement: 70,
  finance: 65,
  communication: 60,
  ressources_humaines: 55,
  secretariat: 50,
  logistique: 45,
  employe: 20,
  agent_terrain: 15,
  auditeur: 12,
  partenaire_lecture: 10,
  lecture_partenaire: 10,
  utilisateur_public: 1,
};

export function mapDbRoleToAppRole(roleName: string): Role | null {
  const mapped = LEGACY_ROLE_MAP[roleName];
  if (mapped) return mapped;
  if ((roles as readonly string[]).includes(roleName)) {
    return roleName as Role;
  }
  return null;
}

export function pickPrimaryRole(roleNames: string[]): Role | null {
  const mapped = roleNames
    .map(mapDbRoleToAppRole)
    .filter((role): role is Role => role !== null);

  if (mapped.length === 0) return null;

  return mapped.reduce((best, current) =>
    ROLE_RANK[current] > ROLE_RANK[best] ? current : best,
  );
}
