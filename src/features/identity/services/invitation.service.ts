import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";
import { appendAuditLog } from "@/features/identity/services/audit.service";
import {
  assertNotSelfRoleChange,
  canAssignRole,
} from "@/features/identity/security/privilege-guards";

export type InviteAdminInput = {
  email: string;
  nomComplet: string;
  roleCode: string;
  actorId: string;
  actorRoles: string[];
  hasInvite: boolean;
  hasCreateAdmin: boolean;
  hasCreateSuperAdmin: boolean;
  hasManagePrincipal?: boolean;
  mfaAal?: string | null;
  reason?: string;
  fonction?: string;
  telephone?: string;
  requireMfa?: boolean;
};

export async function inviteAdministrator(
  supabase: SupabaseClient,
  input: InviteAdminInput,
) {
  const gate = canAssignRole({
    actorRoles: input.actorRoles,
    targetRole: input.roleCode,
    hasCreateSuperAdmin: input.hasCreateSuperAdmin,
    hasCreateAdmin: input.hasCreateAdmin,
    hasInvite: input.hasInvite,
    hasManagePrincipal: input.hasManagePrincipal,
  });
  if (!gate.ok) {
    throw new Error(gate.reason || "Attribution refusée.");
  }

  if (
    (input.roleCode === "super_admin" ||
      input.roleCode === "platform_owner" ||
      input.roleCode === "admin_principal") &&
    input.mfaAal !== "aal2"
  ) {
    throw new Error(
      "MFA (aal2) requis pour inviter un compte très privilégié.",
    );
  }

  if (input.roleCode === "platform_owner" && !input.reason?.trim()) {
    throw new Error("Une raison est obligatoire pour platform_owner.");
  }

  const service = createAdminServiceClient();
  if (!service) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY manquante côté serveur.");
  }

  const email = input.email.toLowerCase().trim();
  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  const { data, error } = await service.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${site}/auth/callback?next=/nouveau-mot-de-passe`,
  });

  if (error || !data.user) {
    throw new Error("Échec de l’invitation. Vérifiez l’e-mail et réessayez.");
  }

  const userId = data.user.id;

  const { error: profileError } = await service
    .from("profils_administrateurs" as never)
    .upsert(
      {
        id: userId,
        email,
        nom_complet: input.nomComplet,
        nom_affichage: input.nomComplet,
        email_professionnel: email,
        telephone: input.telephone ?? null,
        fonction: input.fonction ?? null,
        actif: true,
        statut_compte: "invited",
        doit_configurer_mfa:
          input.requireMfa ||
          input.roleCode === "super_admin" ||
          input.roleCode === "platform_owner" ||
          input.roleCode === "admin_principal",
        cree_par: input.actorId,
        updated_at: new Date().toISOString(),
      } as never,
      { onConflict: "id" },
    );

  if (profileError) {
    await service.auth.admin.deleteUser(userId).catch(() => undefined);
    throw new Error("Échec de création du profil.");
  }

  const { data: roleRow } = await service
    .from("roles" as never)
    .select("id")
    .eq("nom", input.roleCode)
    .maybeSingle();

  if (!roleRow || typeof roleRow !== "object" || !("id" in roleRow)) {
    await service.auth.admin.deleteUser(userId).catch(() => undefined);
    throw new Error("Rôle introuvable.");
  }

  await service.from("utilisateurs_roles" as never).upsert(
    {
      utilisateur_id: userId,
      role_id: (roleRow as { id: string }).id,
    } as never,
    { onConflict: "utilisateur_id,role_id" },
  );

  await service.from("admin_invitations" as never).insert({
    email,
    role_code: input.roleCode,
    invited_by: input.actorId,
    user_id: userId,
    statut: "pending",
    payload: {
      nomComplet: input.nomComplet,
      fonction: input.fonction,
      reason: input.reason,
    },
    expires_at: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
  } as never);

  if (
    input.roleCode === "admin_principal" ||
    input.roleCode === "administrateur"
  ) {
    await service.from("admin_principal_history" as never).insert({
      user_id: userId,
      action: "invited",
      actor_id: input.actorId,
      justification: input.reason ?? null,
      metadata: { email, role: input.roleCode },
    } as never);
  }

  await appendAuditLog(supabase, {
    action: "users.invite",
    module: "identity",
    entityType: "profils_administrateurs",
    entityId: userId,
    newValues: {
      email,
      role: input.roleCode,
    },
    reason: input.reason,
    sensitivity:
      input.roleCode === "platform_owner" ||
      input.roleCode === "super_admin" ||
      input.roleCode === "admin_principal"
        ? "strictement_confidentiel"
        : "sensible",
  });

  return { userId, email };
}

export async function updateUserRoleSecure(
  supabase: SupabaseClient,
  input: {
    actorId: string;
    targetId: string;
    newRole: string;
    actorRoles: string[];
    hasAssignRoles: boolean;
    hasCreateSuperAdmin: boolean;
    mfaAal?: string | null;
  },
) {
  assertNotSelfRoleChange(input.actorId, input.targetId);

  const gate = canAssignRole({
    actorRoles: input.actorRoles,
    targetRole: input.newRole,
    hasCreateSuperAdmin: input.hasCreateSuperAdmin,
    hasCreateAdmin: input.hasAssignRoles,
    hasInvite: input.hasAssignRoles,
  });
  if (!gate.ok) throw new Error(gate.reason);

  if (
    (input.newRole === "super_admin" || input.newRole === "platform_owner") &&
    input.mfaAal !== "aal2"
  ) {
    throw new Error("MFA requis pour ce changement de rôle.");
  }

  if (input.newRole !== "platform_owner") {
    // Protection dernier owner
    const { data: targetRoles } = await supabase
      .from("utilisateurs_roles" as never)
      .select("roles(nom)")
      .eq("utilisateur_id", input.targetId);

    const names = (targetRoles ?? []).flatMap((row) => {
      const r = row as { roles?: { nom?: string } | { nom?: string }[] | null };
      if (!r.roles) return [];
      if (Array.isArray(r.roles)) return r.roles.map((x) => x.nom || "");
      return [r.roles.nom || ""];
    });

    if (names.includes("platform_owner")) {
      const { data: count } = await supabase.rpc(
        "count_active_platform_owners" as never,
      );
      if (typeof count === "number" && count <= 1) {
        throw new Error(
          "Le dernier platform_owner actif ne peut pas être rétrogradé.",
        );
      }
    }
  }

  const service = createAdminServiceClient();
  const client = service ?? supabase;

  const { data: roleRow } = await client
    .from("roles" as never)
    .select("id")
    .eq("nom", input.newRole)
    .maybeSingle();
  if (!roleRow || typeof roleRow !== "object" || !("id" in roleRow)) {
    throw new Error("Rôle introuvable.");
  }

  await client
    .from("utilisateurs_roles" as never)
    .delete()
    .eq("utilisateur_id", input.targetId);
  await client.from("utilisateurs_roles" as never).insert({
    utilisateur_id: input.targetId,
    role_id: (roleRow as { id: string }).id,
  } as never);

  await appendAuditLog(supabase, {
    action: "users.assign_roles",
    module: "identity",
    entityType: "utilisateurs_roles",
    entityId: input.targetId,
    newValues: { role: input.newRole },
    sensitivity: "strictement_confidentiel",
  });
}
