"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAnyPermission } from "@/lib/auth/guards";
import { createClientSafe } from "@/lib/supabase/safe";
import { isSuperActor } from "@/features/identity/security/privilege-guards";
import { suspendPrincipalAdmin, reactivatePrincipalAdmin } from "@/features/identity/services/principal-admin.service";

const suspendSchema = z.object({
  target_id: z.string().uuid(),
  justification: z.string().min(8).max(500),
});

export async function suspendPrincipalAction(formData: FormData) {
  const session = await requireAnyPermission([
    "users.manage_principal",
    "users.create_super_admin",
  ]);
  if (!isSuperActor(session.roles)) {
    return;
  }

  const parsed = suspendSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  await suspendPrincipalAdmin({
    supabase,
    targetId: parsed.data.target_id,
    actorId: session.user.id,
    justification: parsed.data.justification,
  });

  revalidatePath("/admin/administrateur-principal");
  revalidatePath("/admin/utilisateurs");
}

export async function reactivatePrincipalAction(formData: FormData) {
  const session = await requireAnyPermission([
    "users.manage_principal",
    "users.create_super_admin",
  ]);
  if (!isSuperActor(session.roles)) {
    return;
  }

  const parsed = suspendSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  try {
    await reactivatePrincipalAdmin({
      supabase,
      targetId: parsed.data.target_id,
      actorId: session.user.id,
      justification: parsed.data.justification,
    });
  } catch {
    return;
  }

  revalidatePath("/admin/administrateur-principal");
  revalidatePath("/admin/utilisateurs");
}
