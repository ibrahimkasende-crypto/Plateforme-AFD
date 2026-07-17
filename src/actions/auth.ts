"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAdminProfile } from "@/lib/auth/get-user-role";
import { logAdminActivity } from "@/lib/auth/log-admin-activity";

const signInSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide").max(200),
  password: z.string().min(8, "Mot de passe invalide").max(200),
  next: z.string().optional(),
});

const emailSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide").max(200),
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(200),
  confirmPassword: z.string().min(8).max(200),
});

export type AuthActionResult = {
  ok: boolean;
  message: string;
};

function safeNextPath(next?: string): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/admin";
  }
  return next;
}

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export async function signIn(input: unknown): Promise<AuthActionResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Veuillez vérifier votre adresse e-mail et votre mot de passe.",
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
    });

    if (error || !data.user) {
      await logAdminActivity("auth.login_denied", {
        reason: "invalid_credentials",
        email: parsed.data.email.toLowerCase(),
      });
      return {
        ok: false,
        message: "Identifiants incorrects ou compte inaccessible.",
      };
    }

    const profile = await getAdminProfile(data.user.id);
    if (!profile) {
      await supabase.auth.signOut();
      await logAdminActivity(
        "auth.login_denied",
        { reason: "profile_missing", email: parsed.data.email.toLowerCase() },
        data.user.id,
      );
      return {
        ok: false,
        message:
          "Aucun profil administrateur n’est associé à ce compte. Contactez la direction.",
      };
    }

    if (!profile.actif) {
      await supabase.auth.signOut();
      await logAdminActivity(
        "auth.account_disabled_attempt",
        { email: profile.email },
        data.user.id,
      );
      return {
        ok: false,
        message: "Ce compte administrateur est désactivé.",
      };
    }

    await supabase
      .from("profils_administrateurs" as never)
      .update({ derniere_connexion: new Date().toISOString() } as never)
      .eq("id", data.user.id);

    await logAdminActivity(
      "auth.login_success",
      { email: profile.email },
      data.user.id,
    );

    redirect(safeNextPath(parsed.data.next));
  } catch (error) {
    // Next.js redirect throws — rethrow
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    return {
      ok: false,
      message: "La connexion a échoué. Réessayez dans quelques instants.",
    };
  }
}

export async function signOut(): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.auth.signOut();
    if (user) {
      await logAdminActivity("auth.logout", {}, user.id);
    }
  } catch {
    // Continuer la redirection même en cas d’erreur réseau.
  }
  redirect("/connexion");
}

export async function requestPasswordReset(
  input: unknown,
): Promise<AuthActionResult> {
  const parsed = emailSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Veuillez saisir une adresse e-mail valide." };
  }

  try {
    const supabase = await createClient();
    const email = parsed.data.email.toLowerCase();

    // Toujours message générique (ne pas révéler l’existence du compte).
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl()}/auth/callback?next=/nouveau-mot-de-passe`,
    });

    await logAdminActivity("auth.password_reset_requested", { email });

    return {
      ok: true,
      message:
        "Si un compte administrateur existe pour cette adresse, un e-mail de réinitialisation a été envoyé.",
    };
  } catch {
    return {
      ok: false,
      message: "La demande n’a pas pu être envoyée. Réessayez plus tard.",
    };
  }
}

export async function updatePassword(
  input: unknown,
): Promise<AuthActionResult> {
  const parsed = passwordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Le mot de passe doit contenir au moins 8 caractères.",
    };
  }

  if (parsed.data.password !== parsed.data.confirmPassword) {
    return {
      ok: false,
      message: "Les mots de passe ne correspondent pas.",
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        ok: false,
        message: "Session expirée. Relancez la procédure depuis l’e-mail reçu.",
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });

    if (error) {
      return {
        ok: false,
        message: "Le mot de passe n’a pas pu être mis à jour. Réessayez.",
      };
    }

    await logAdminActivity("auth.password_updated", {}, user.id);

    return {
      ok: true,
      message: "Mot de passe mis à jour. Vous pouvez vous connecter.",
    };
  } catch {
    return {
      ok: false,
      message: "Une erreur est survenue. Réessayez plus tard.",
    };
  }
}
