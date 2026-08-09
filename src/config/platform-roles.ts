/**
 * Rôles plateforme et rôles organisation pour l’administration AFD.
 */

export const platformRoles = [
  "platform_owner",
  "platform_admin",
  "support_agent",
  "billing_admin",
] as const;

export type PlatformRole = (typeof platformRoles)[number];

export const platformRoleLabels: Record<PlatformRole, string> = {
  platform_owner: "Propriétaire plateforme AFD",
  platform_admin: "Administrateur plateforme",
  support_agent: "Agent support",
  billing_admin: "Administrateur facturation",
};

export const tenantRoles = [
  "tenant_owner",
  "tenant_super_admin",
  "administrateur",
  "responsable_module",
  "employe",
  "agent_terrain",
  "auditeur",
] as const;

export type TenantRole = (typeof tenantRoles)[number];

export const tenantRoleLabels: Record<TenantRole, string> = {
  tenant_owner: "Propriétaire organisation",
  tenant_super_admin: "Super administrateur organisation",
  administrateur: "Administrateur",
  responsable_module: "Responsable de module",
  employe: "Employé",
  agent_terrain: "Agent terrain",
  auditeur: "Auditeur",
};

export function isPlatformRole(role: string): role is PlatformRole {
  return (platformRoles as readonly string[]).includes(role);
}

export function isTenantRole(role: string): role is TenantRole {
  return (tenantRoles as readonly string[]).includes(role);
}
