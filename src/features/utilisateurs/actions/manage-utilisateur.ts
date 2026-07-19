"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { roles } from "@/config/roles";
import { requirePermission } from "@/lib/auth/require-permission";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";
import { createClientSafe } from "@/lib/supabase/safe";
import { hasPermission } from "@/lib/auth/has-permission";
import { getUserRoleNames } from "@/lib/auth/get-user-role";
import { inviteUserAction } from "@/features/identity/actions/invite-user";
import {
  assertNotSelfAccountDeletion,
  assertNotSelfRoleChange,
} from "@/features/identity/security/privilege-guards";
import { updateUserRoleSecure } from "@/features/identity/services/invitation.service";
import { appendAuditLog } from "@/features/identity/services/audit.service";

const roleEnum = z.enum(roles);

const updateSchema = z.object({
  nom_complet: z.string().min(2),
  actif: z.string().optional(),
  role: roleEnum.optional(),
});

/** @deprecated Préférer inviteUserAction — délègue au flux d'invitation sécurisé. */
export async function createAdminUser(formData: FormData) {
  return inviteUserAction(formData);
}

export async function updateAdminUser(formData: FormData) {
  const session = await requirePermission("users.edit");
  const id = String(formData.get("id") || "");
  if (!z.string().uuid().safeParse(id).success) return;

  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const actorRoles = await getUserRoleNames(session.user.id);
  const becomingInactive = parsed.data.actif !== "on";

  if (parsed.data.role) {
    assertNotSelfRoleChange(session.user.id, id);

    const canAssign = await hasPermission(session.user.id, "users.assign_roles");
    if (!canAssign) return;

    const {
      data: { session: authSession },
    } = await supabase.auth.getSession();
    const mfaAal =
      (authSession as { aal?: string } | null)?.aal ||
      ((await supabase.auth.getUser()).data.user?.app_metadata?.aal as
        | string
        | undefined) ||
      null;

    const hasCreateSuperAdmin = await hasPermission(
      session.user.id,
      "users.create_super_admin",
    );

    try {
      await updateUserRoleSecure(supabase, {
        actorId: session.user.id,
        targetId: id,
        newRole: parsed.data.role,
        actorRoles,
        hasAssignRoles: true,
        hasCreateSuperAdmin,
        mfaAal: mfaAal || (process.env.NODE_ENV !== "production" ? "aal2" : null),
      });
    } catch {
      return;
    }
  }

  if (becomingInactive) {
    assertNotSelfAccountDeletion(session.user.id, id);
    const [canDisable, canSuspend] = await Promise.all([
      hasPermission(session.user.id, "users.disable"),
      hasPermission(session.user.id, "users.suspend"),
    ]);
    if (!canDisable && !canSuspend) return;
  }

  await supabase
    .from("profils_administrateurs" as never)
    .update({
      nom_complet: parsed.data.nom_complet,
      actif: parsed.data.actif === "on",
      statut_compte: parsed.data.actif === "on" ? "active" : "disabled",
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", id);

  if (becomingInactive) {
    await appendAuditLog(supabase, {
      action: "users.disable",
      module: "identity",
      entityType: "profils_administrateurs",
      entityId: id,
      sensitivity: "sensible",
    });
  }

  revalidatePath("/admin/utilisateurs");
  revalidatePath(`/admin/utilisateurs/${id}`);
  redirect(`/admin/utilisateurs/${id}`);
}

export async function deactivateAdminUser(id: string) {
  const session = await requirePermission("users.edit");
  if (!z.string().uuid().safeParse(id).success) return;

  try {
    assertNotSelfAccountDeletion(session.user.id, id);
  } catch {
    return;
  }

  const [canDisable, canSuspend] = await Promise.all([
    hasPermission(session.user.id, "users.disable"),
    hasPermission(session.user.id, "users.suspend"),
  ]);
  if (!canDisable && !canSuspend) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  await supabase
    .from("profils_administrateurs" as never)
    .update({
      actif: false,
      statut_compte: "disabled",
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", id);

  await appendAuditLog(supabase, {
    action: "users.disable",
    module: "identity",
    entityType: "profils_administrateurs",
    entityId: id,
    sensitivity: "sensible",
  });

  revalidatePath("/admin/utilisateurs");
}

export async function getInviteAvailable(): Promise<boolean> {
  await getCurrentUser();
  return Boolean(createAdminServiceClient());
}
