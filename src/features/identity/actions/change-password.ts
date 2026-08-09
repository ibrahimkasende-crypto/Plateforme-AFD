"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { validatePasswordPolicy } from "@/lib/auth/password-policy";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { logAdminActivity } from "@/lib/auth/log-admin-activity";

export type PasswordChangeResult = {
  ok: boolean;
  message: string;
};

const changeSchema = z.object({
  currentPassword: z.string().min(1).max(200).optional(),
  password: z.string().min(12).max(200),
  confirmPassword: z.string().min(12).max(200),
});

/**
 * Changement de mot de passe (obligatoire ou volontaire).
 * Ne journalise jamais le secret.
 */
export async function changeOwnPassword(
  input: unknown,
): Promise<PasswordChangeResult> {
  const session = await requireAdmin("/admin/securite/changer-mot-de-passe");
  const parsed = changeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Vérifiez les champs du formulaire.",
    };
  }

  const { password, confirmPassword, currentPassword } = parsed.data;
  if (password !== confirmPassword) {
    return { ok: false, message: "Les mots de passe ne correspondent pas." };
  }

  const policy = validatePasswordPolicy(password, {
    email: session.user.email,
    displayName: session.profile.nom_complet,
    firstName: session.profile.prenom,
    lastName: session.profile.nom_famille,
  });
  if (!policy.ok) {
    return { ok: false, message: policy.message ?? "Mot de passe invalide." };
  }

  const supabase = await createClient();

  if (currentPassword) {
    const email = session.user.email;
    if (!email) {
      return { ok: false, message: "E-mail de session introuvable." };
    }
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });
    if (reauthError) {
      return { ok: false, message: "Mot de passe actuel incorrect." };
    }
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return {
      ok: false,
      message: "Le mot de passe n’a pas pu être mis à jour. Réessayez.",
    };
  }

  const now = new Date().toISOString();
  await supabase
    .from("profils_administrateurs" as never)
    .update({
      must_change_password: false,
      password_changed_at: now,
      updated_at: now,
    } as never)
    .eq("id", session.user.id);

  await logAdminActivity(
    "auth.password_updated",
    { forced: Boolean(session.profile.must_change_password) },
    session.user.id,
  );

  try {
    await supabase.auth.signOut({ scope: "others" });
  } catch {
    // scope others peut être indisponible selon version Auth
  }

  revalidatePath("/admin");
  revalidatePath("/admin/mon-profil");
  revalidatePath("/admin/securite/changer-mot-de-passe");

  return {
    ok: true,
    message: "Mot de passe mis à jour. Vous pouvez accéder au tableau de bord.",
  };
}
