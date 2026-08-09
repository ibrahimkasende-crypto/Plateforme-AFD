import "server-only";

import type { Role } from "@/config/roles";
import {
  PRINCIPAL_ROLE_CODES,
  principalAssignableRoles,
} from "@/config/afd-staff";

const SUPER_ACTORS = new Set(["super_admin", "platform_owner"]);

const PRINCIPAL_ACTORS = new Set([
  "admin_principal_direction",
  "admin_principal_it",
  "admin_principal",
  "administrateur",
  ...SUPER_ACTORS,
]);

export function isPrincipalRole(role: string): boolean {
  return (PRINCIPAL_ROLE_CODES as readonly string[]).includes(role);
}

export function isSuperActor(roles: string[]): boolean {
  return roles.some((r) => SUPER_ACTORS.has(r));
}

export function isPrincipalActor(roles: string[]): boolean {
  return roles.some((r) => PRINCIPAL_ACTORS.has(r));
}

export function isPrivilegedRole(role: string): boolean {
  return (
    SUPER_ACTORS.has(role) ||
    isPrincipalRole(role) ||
    role === "admin_module"
  );
}

export function requiresOwnerForRole(role: string): boolean {
  return role === "platform_owner";
}

function actorIsPrincipalOnly(actorRoles: string[]): boolean {
  return isPrincipalActor(actorRoles) && !isSuperActor(actorRoles);
}

/**
 * Règles AFD :
 * - super_admin / platform_owner → peut créer / remplacer les sièges Direction & IT
 * - admin_principal_* → crée agents / modules / responsables (jamais super_admin)
 * - personne ne s’auto-attribue un rôle via cette fonction seule
 */
export function canAssignRole(params: {
  actorRoles: string[];
  targetRole: string;
  hasCreateSuperAdmin: boolean;
  hasCreateAdmin: boolean;
  hasInvite: boolean;
  hasManagePrincipal?: boolean;
}): { ok: boolean; reason?: string } {
  const {
    actorRoles,
    targetRole,
    hasCreateSuperAdmin,
    hasCreateAdmin,
    hasInvite,
    hasManagePrincipal = false,
  } = params;

  if (!hasInvite && !hasCreateAdmin && !hasCreateSuperAdmin && !hasManagePrincipal) {
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
    if (actorIsPrincipalOnly(actorRoles)) {
      return {
        ok: false,
        reason:
          "Un Administrateur principal ne peut pas créer un Super Administrateur.",
      };
    }
    if (!actorRoles.includes("platform_owner") && !hasCreateSuperAdmin) {
      return {
        ok: false,
        reason:
          "Permission users.create_super_admin ou rôle platform_owner requis.",
      };
    }
    return { ok: true };
  }

  if (isPrincipalRole(targetRole)) {
    if (
      !isSuperActor(actorRoles) &&
      !hasManagePrincipal &&
      !hasCreateAdmin
    ) {
      return {
        ok: false,
        reason:
          "Seul le Super Administrateur peut créer ou remplacer un Administrateur principal.",
      };
    }
    if (actorIsPrincipalOnly(actorRoles)) {
      return {
        ok: false,
        reason:
          "Un Administrateur principal ne peut pas créer ni remplacer un autre siège principal.",
      };
    }
    return { ok: true };
  }

  if (
    isPrincipalActor(actorRoles) ||
    hasInvite ||
    hasCreateAdmin
  ) {
    if (isSuperActor(actorRoles)) {
      return { ok: true };
    }
    if (
      (principalAssignableRoles as readonly string[]).includes(targetRole)
    ) {
      return { ok: true };
    }
    return {
      ok: false,
      reason: "Rôle cible non autorisé pour l’Administrateur principal.",
    };
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

export function assertCannotTouchSuperAdmin(
  actorRoles: string[],
  targetRoles: string[],
): void {
  const targetIsSuper =
    targetRoles.includes("super_admin") ||
    targetRoles.includes("platform_owner");
  if (targetIsSuper && !isSuperActor(actorRoles)) {
    throw new Error(
      "Un Administrateur principal ne peut pas suspendre ni modifier le Super Administrateur.",
    );
  }
}

export function mapLegacyRole(role: string): Role | string {
  if (role === "lecture_partenaire") return "partenaire_lecture";
  if (role === "administrateur") return "admin_principal";
  return role;
}
