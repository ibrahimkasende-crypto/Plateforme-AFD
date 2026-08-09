"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAdminProfile } from "@/lib/auth/get-user-role";
import { logAdminActivity } from "@/lib/auth/log-admin-activity";
import { validatePasswordPolicy } from "@/lib/auth/password-policy";

const signInSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide").max(200),
  password: z.string().min(1, "Mot de passe invalide").max(200),
  next: z.string().optional(),
});

const emailSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide").max(200),
});

const passwordSchema = z.object({
  password: z.string().min(12).max(200),
  confirmPassword: z.string().min(12).max(200),
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
      const code = error?.code ?? error?.message ?? "unknown";
      await logAdminActivity("auth.login_denied", {
        reason: String(code),
        email: parsed.data.email.toLowerCase(),
      });

      const lowered = (error?.message ?? "").toLowerCase();
      if (
        lowered.includes("email not confirmed") ||
        error?.code === "email_not_confirmed"
      ) {
        return {
          ok: false,
          message:
            "Votre e-mail n’est pas encore confirmé. Dans Supabase → Authentication → Users, ouvrez votre compte et confirmez l’e-mail (ou cochez « Auto Confirm »).",
        };
      }

      // Ne pas utiliser status===401 : mauvais mot de passe peut aussi être 401.
      const keyBroken =
        lowered.includes("invalid api key") ||
        lowered.includes("invalid jwt") ||
        lowered.includes("jwt malformed") ||
        lowered.includes("no api key found");

      if (keyBroken) {
        return {
          ok: false,
          message:
            "Clé Supabase invalide sur Hostinger. Importez Deploy/hostinger.env (URL + ANON ou PUBLISHABLE du projet mxxuxnoqnwjygawvvhcb), puis Redeploy / Rebuild.",
        };
      }

      // En développement : afficher le détail Supabase pour diagnostiquer.
      if (process.env.NODE_ENV === "development" && error?.message) {
        return {
          ok: false,
          message: `Échec Auth Supabase : ${error.message}. Vérifiez que le compte existe dans le projet Supabase configuré et que Email/Password est activé.`,
        };
      }

      const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      const wrongProject =
        process.env.NEXT_PUBLIC_APP_ENV === "production" &&
        envUrl.length > 0 &&
        !envUrl.includes("mxxuxnoqnwjygawvvhcb");

      return {
        ok: false,
        message: wrongProject
          ? "Hostinger pointe vers le mauvais projet Supabase. Dans les variables d’environnement, mettez NEXT_PUBLIC_SUPABASE_URL=https://mxxuxnoqnwjygawvvhcb.supabase.co et les clés anon/service du même projet, puis redéployez."
          : "Identifiants incorrects ou compte inaccessible. Vérifiez l’e-mail exact et le mot de passe, ou réinitialisez-le dans Supabase Auth (projet mxxuxnoqnwjygawvvhcb).",
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

    const statut = (profile.statut_compte || "").toLowerCase();
    const statutBloque =
      statut === "suspendu" ||
      statut === "desactive" ||
      statut === "disabled" ||
      statut === "inactive";

    if (!profile.actif || statutBloque) {
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
      redirectTo: `${siteUrl()}/auth/reset-password`,
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
      message: "Le mot de passe doit contenir au moins 12 caractères.",
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

    const profile = await getAdminProfile(user.id);
    const policy = validatePasswordPolicy(parsed.data.password, {
      email: user.email,
      displayName: profile?.nom_complet,
      firstName: profile?.prenom,
      lastName: profile?.nom_famille,
    });
    if (!policy.ok) {
      return {
        ok: false,
        message: policy.message ?? "Mot de passe invalide.",
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

    const now = new Date().toISOString();
    await supabase
      .from("profils_administrateurs" as never)
      .update({
        must_change_password: false,
        password_changed_at: now,
        updated_at: now,
      } as never)
      .eq("id", user.id);

    await logAdminActivity("auth.password_updated", { source: "reset" }, user.id);

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
