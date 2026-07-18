"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { roles } from "@/config/roles";
import { requirePermission } from "@/lib/auth/require-permission";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";
import { createClientSafe } from "@/lib/supabase/safe";

const roleEnum = z.enum(roles);

const createSchema = z.object({
  email: z.string().email(),
  nom_complet: z.string().min(2),
  role: roleEnum,
  actif: z.string().optional(),
});

const updateSchema = z.object({
  nom_complet: z.string().min(2),
  actif: z.string().optional(),
  role: roleEnum.optional(),
});

export async function createAdminUser(formData: FormData) {
  const session = await requirePermission("utilisateurs:write");
  const parsed = createSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const email = parsed.data.email.toLowerCase();
  const service = createAdminServiceClient();
  let userId: string | null = null;

  if (service) {
    const { data, error } = await service.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000"}/auth/callback?next=/nouveau-mot-de-passe`,
    });
    if (error || !data.user) return;
    userId = data.user.id;
  }

  const supabase = await createClientSafe();
  if (!supabase) return;

  if (!userId) {
    return;
  }

  await supabase.from("profils_administrateurs" as never).upsert(
    {
      id: userId,
      email,
      nom_complet: parsed.data.nom_complet,
      actif: parsed.data.actif !== "off",
      updated_at: new Date().toISOString(),
    } as never,
    { onConflict: "id" },
  );

  const { data: roleRow } = await supabase
    .from("roles" as never)
    .select("id")
    .eq("nom", parsed.data.role)
    .maybeSingle();

  if (roleRow && typeof roleRow === "object" && "id" in roleRow) {
    await supabase.from("utilisateurs_roles" as never).upsert(
      {
        utilisateur_id: userId,
        role_id: (roleRow as { id: string }).id,
      } as never,
      { onConflict: "utilisateur_id,role_id" },
    );
  }

  if (userId === session.user.id) {
    return;
  }

  revalidatePath("/admin/utilisateurs");
  redirect("/admin/utilisateurs");
}

export async function updateAdminUser(formData: FormData) {
  const session = await requirePermission("utilisateurs:write");
  const id = String(formData.get("id") || "");
  if (!z.string().uuid().safeParse(id).success) return;

  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  await supabase
    .from("profils_administrateurs" as never)
    .update({
      nom_complet: parsed.data.nom_complet,
      actif: parsed.data.actif === "on",
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", id);

  if (parsed.data.role && id !== session.user.id) {
    const { data: roleRow } = await supabase
      .from("roles" as never)
      .select("id")
      .eq("nom", parsed.data.role)
      .maybeSingle();

    if (roleRow && typeof roleRow === "object" && "id" in roleRow) {
      await supabase.from("utilisateurs_roles" as never).delete().eq("utilisateur_id", id);
      await supabase.from("utilisateurs_roles" as never).insert({
        utilisateur_id: id,
        role_id: (roleRow as { id: string }).id,
      } as never);
    }
  }

  revalidatePath("/admin/utilisateurs");
  revalidatePath(`/admin/utilisateurs/${id}`);
  redirect(`/admin/utilisateurs/${id}`);
}

export async function deactivateAdminUser(id: string) {
  const session = await requirePermission("utilisateurs:write");
  if (id === session.user.id) return;

  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;

  await supabase
    .from("profils_administrateurs" as never)
    .update({ actif: false, updated_at: new Date().toISOString() } as never)
    .eq("id", id);

  revalidatePath("/admin/utilisateurs");
}

export async function getInviteAvailable(): Promise<boolean> {
  await getCurrentUser();
  return Boolean(createAdminServiceClient());
}
