"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { hasPermission } from "@/lib/auth/has-permission";
import { getUserRoleNames } from "@/lib/auth/get-user-role";
import { inviteAdministrator } from "@/features/identity/services/invitation.service";
import { assertCanCreatePrincipal } from "@/features/identity/services/principal-admin.service";
import { isPrincipalRole } from "@/features/identity/security/privilege-guards";

const schema = z.object({
  email: z.string().email(),
  nom_complet: z.string().min(2).max(160),
  role: z.string().min(2),
  fonction: z.string().optional(),
  telephone: z.string().optional(),
  reason: z.string().optional(),
  require_mfa: z.string().optional(),
  redirect_to: z.string().optional(),
});

export async function inviteUserAction(formData: FormData): Promise<void> {
  const session = await requirePermission("users.invite");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const actorRoles = await getUserRoleNames(session.user.id);

  const {
    data: { session: authSession },
  } = await supabase.auth.getSession();
  const mfaAal =
    (authSession as { aal?: string } | null)?.aal ||
    ((await supabase.auth.getUser()).data.user?.app_metadata?.aal as
      | string
      | undefined) ||
    null;

  const [hasCreateAdmin, hasCreateSuperAdmin, hasManagePrincipal] =
    await Promise.all([
      hasPermission(session.user.id, "users.create_admin"),
      hasPermission(session.user.id, "users.create_super_admin"),
      hasPermission(session.user.id, "users.manage_principal"),
    ]);

  try {
    if (isPrincipalRole(parsed.data.role)) {
      await assertCanCreatePrincipal(supabase, parsed.data.role);
    }
    await inviteAdministrator(supabase, {
      email: parsed.data.email,
      nomComplet: parsed.data.nom_complet,
      roleCode: parsed.data.role,
      actorId: session.user.id,
      actorRoles,
      hasInvite: true,
      hasCreateAdmin,
      hasCreateSuperAdmin,
      hasManagePrincipal,
      mfaAal: mfaAal || (process.env.NODE_ENV !== "production" ? "aal2" : null),
      reason: parsed.data.reason,
      fonction: parsed.data.fonction,
      telephone: parsed.data.telephone,
      requireMfa: parsed.data.require_mfa === "on",
    });
  } catch {
    return;
  }

  revalidatePath("/admin/utilisateurs");
  revalidatePath("/admin/invitations");
  revalidatePath("/admin/administrateur-principal");
  const redirectTo =
    parsed.data.redirect_to?.startsWith("/admin/")
      ? parsed.data.redirect_to
      : "/admin/utilisateurs";
  redirect(redirectTo);
}
