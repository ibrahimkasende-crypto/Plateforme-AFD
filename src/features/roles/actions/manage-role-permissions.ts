"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export async function toggleRolePermission(formData: FormData) {
  await requirePermission("roles:manage");
  const roleId = String(formData.get("role_id") || "");
  const permissionId = String(formData.get("permission_id") || "");
  const enabled = String(formData.get("enabled") || "") === "true";

  if (!z.string().uuid().safeParse(roleId).success) return;
  if (!z.string().uuid().safeParse(permissionId).success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  if (enabled) {
    await supabase.from("roles_permissions" as never).upsert(
      { role_id: roleId, permission_id: permissionId } as never,
      { onConflict: "role_id,permission_id" },
    );
  } else {
    await supabase
      .from("roles_permissions" as never)
      .delete()
      .eq("role_id", roleId)
      .eq("permission_id", permissionId);
  }

  revalidatePath("/admin/roles");
}
