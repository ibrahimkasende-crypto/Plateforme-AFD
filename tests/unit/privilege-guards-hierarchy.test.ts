import { describe, expect, it } from "vitest";
import { canAssignRole } from "@/features/identity/security/privilege-guards";

describe("canAssignRole — hiérarchie AFD", () => {
  it("refuse qu’un admin_principal crée un super_admin", () => {
    const result = canAssignRole({
      actorRoles: ["admin_principal"],
      targetRole: "super_admin",
      hasCreateSuperAdmin: true,
      hasCreateAdmin: true,
      hasInvite: true,
      hasManagePrincipal: false,
    });
    expect(result.ok).toBe(false);
  });

  it("autorise le super_admin à créer l’admin_principal", () => {
    const result = canAssignRole({
      actorRoles: ["super_admin"],
      targetRole: "admin_principal",
      hasCreateSuperAdmin: true,
      hasCreateAdmin: true,
      hasInvite: true,
      hasManagePrincipal: true,
    });
    expect(result.ok).toBe(true);
  });

  it("refuse qu’un admin_principal crée un autre admin_principal", () => {
    const result = canAssignRole({
      actorRoles: ["admin_principal"],
      targetRole: "admin_principal",
      hasCreateSuperAdmin: false,
      hasCreateAdmin: true,
      hasInvite: true,
      hasManagePrincipal: false,
    });
    expect(result.ok).toBe(false);
  });

  it("autorise l’admin_principal à créer un agent", () => {
    const result = canAssignRole({
      actorRoles: ["admin_principal"],
      targetRole: "agent",
      hasCreateSuperAdmin: false,
      hasCreateAdmin: true,
      hasInvite: true,
    });
    expect(result.ok).toBe(true);
  });

  it("refuse qu’un agent simple invite", () => {
    const result = canAssignRole({
      actorRoles: ["agent"],
      targetRole: "agent",
      hasCreateSuperAdmin: false,
      hasCreateAdmin: false,
      hasInvite: false,
    });
    expect(result.ok).toBe(false);
  });
});
