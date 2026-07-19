import "server-only";

import type { Role } from "@/config/roles";

const PRIVILEGED_ROLES = new Set([
  "platform_owner",
  "super_admin",
  "administrateur",
]);

const OWNER_ONLY_ROLES = new Set(["platform_owner"]);

const SUPER_ADMIN_CREATABLE = new Set([
  "administrateur",
  "responsable_module",
  "employe",
  "agent_terrain",
  "auditeur",
  "partenaire_lecture",
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
]);

export function isPrivilegedRole(role: string): boolean {
  return PRIVILEGED_ROLES.has(role);
}

export function requiresOwnerForRole(role: string): boolean {
  return OWNER_ONLY_ROLES.has(role);
}

export function canAssignRole(params: {
  actorRoles: string[];
  targetRole: string;
  hasCreateSuperAdmin: boolean;
  hasCreateAdmin: boolean;
  hasInvite: boolean;
}): { ok: boolean; reason?: string } {
  const { actorRoles, targetRole, hasCreateSuperAdmin, hasCreateAdmin, hasInvite } =
    params;

  if (!hasInvite && !hasCreateAdmin && !hasCreateSuperAdmin) {
    return { ok: false, reason: "Permission d’invitation manquante." };
  }

  if (targetRole === "platform_owner") {
    if (!actorRoles.includes("platform_owner")) {
      return {
        ok: false,
        reason: "Seul un platform_owner peut initier la création d’un autre owner.",
      };
    }
    return { ok: true };
  }

  if (targetRole === "super_admin") {
    if (!actorRoles.includes("platform_owner") && !hasCreateSuperAdmin) {
      return {
        ok: false,
        reason: "Permission users.create_super_admin ou rôle platform_owner requis.",
      };
    }
    return { ok: true };
  }

  if (targetRole === "administrateur") {
    if (
      !actorRoles.includes("platform_owner") &&
      !actorRoles.includes("super_admin") &&
      !hasCreateAdmin
    ) {
      return { ok: false, reason: "Permission users.create_admin requise." };
    }
    return { ok: true };
  }

  if (
    actorRoles.includes("platform_owner") ||
    actorRoles.includes("super_admin") ||
    hasInvite
  ) {
    if (
      !SUPER_ADMIN_CREATABLE.has(targetRole) &&
      !actorRoles.includes("platform_owner")
    ) {
      return { ok: false, reason: "Rôle cible non autorisé." };
    }
    return { ok: true };
  }

  return { ok: false, reason: "Attribution de rôle refusée." };
}

export function assertNotSelfRoleChange(
  actorId: string,
  targetId: string,
): void {
  if (actorId === targetId) {
    throw new Error(
      "Vous ne pouvez pas modifier votre propre rôle ni vos propres permissions.",
    );
  }
}

export function assertNotSelfAccountDeletion(
  actorId: string,
  targetId: string,
): void {
  if (actorId === targetId) {
    throw new Error(
      "Vous ne pouvez pas supprimer ou désactiver votre propre compte depuis l’interface.",
    );
  }
}

export function mapLegacyRole(role: string): Role | string {
  if (role === "lecture_partenaire") return "partenaire_lecture";
  return role;
}
