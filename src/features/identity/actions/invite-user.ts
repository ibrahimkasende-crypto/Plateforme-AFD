"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { hasPermission } from "@/lib/auth/has-permission";
import { getUserRole } from "@/lib/auth/get-user-role";
import { inviteAdministrator } from "@/features/identity/services/invitation.service";

const schema = z.object({
  email: z.string().email(),
  nom_complet: z.string().min(2).max(160),
  role: z.string().min(2),
  fonction: z.string().optional(),
  telephone: z.string().optional(),
  reason: z.string().optional(),
  require_mfa: z.string().optional(),
});

export async function inviteUserAction(formData: FormData): Promise<void> {
  const session = await requirePermission("users.invite");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const role = await getUserRole(session.user.id);
  const actorRoles = role ? [role] : [];

  const {
    data: { session: authSession },
  } = await supabase.auth.getSession();
  const mfaAal =
    (authSession as { aal?: string } | null)?.aal ||
    // fallback claim
    ((await supabase.auth.getUser()).data.user?.app_metadata?.aal as
      | string
      | undefined) ||
    null;

  const [hasCreateAdmin, hasCreateSuperAdmin] = await Promise.all([
    hasPermission(session.user.id, "users.create_admin"),
    hasPermission(session.user.id, "users.create_super_admin"),
  ]);

  try {
    await inviteAdministrator(supabase, {
      email: parsed.data.email,
      nomComplet: parsed.data.nom_complet,
      roleCode: parsed.data.role,
      actorId: session.user.id,
      actorRoles,
      hasInvite: true,
      hasCreateAdmin,
      hasCreateSuperAdmin,
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
  redirect("/admin/utilisateurs");
}
