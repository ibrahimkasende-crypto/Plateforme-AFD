import { describe, expect, it } from "vitest";
import {
  canAssignRole,
  assertNotSelfRoleChange,
} from "@/features/identity/security/privilege-guards";

describe("RLS / privilege guards (vague 1)", () => {
  it("refuse l’auto-attribution platform_owner sans être owner", () => {
    const result = canAssignRole({
      actorRoles: ["administrateur"],
      targetRole: "platform_owner",
      hasCreateSuperAdmin: true,
      hasCreateAdmin: true,
      hasInvite: true,
    });
    expect(result.ok).toBe(false);
  });

  it("autorise platform_owner à initier un autre owner", () => {
    const result = canAssignRole({
      actorRoles: ["platform_owner"],
      targetRole: "platform_owner",
      hasCreateSuperAdmin: true,
      hasCreateAdmin: true,
      hasInvite: true,
    });
    expect(result.ok).toBe(true);
  });

  it("bloque la modification de son propre rôle", () => {
    expect(() =>
      assertNotSelfRoleChange("user-a", "user-a"),
    ).toThrow(/propre rôle/i);
  });
});
