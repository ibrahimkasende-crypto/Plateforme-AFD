import { createClient } from "@/lib/supabase/client";

/**
 * Démarre Google OAuth pour récupérer l’e-mail et finaliser l’inscription newsletter
 * via /auth/callback?newsletter=1.
 */
export async function startGoogleNewsletterOAuth(
  returnPath = "/",
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const supabase = createClient();
    const origin = window.location.origin;
    const safeReturn =
      returnPath.startsWith("/") && !returnPath.startsWith("//")
        ? returnPath
        : "/";

    const redirectTo = new URL("/auth/callback", origin);
    redirectTo.searchParams.set("newsletter", "1");
    redirectTo.searchParams.set("next", safeReturn);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo.toString(),
        scopes: "email profile",
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    });

    if (error) {
      return {
        ok: false,
        message:
          "La connexion Google n’est pas disponible. Activez le provider Google dans Supabase, ou inscrivez-vous avec votre e-mail.",
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      message:
        "Impossible de démarrer Google pour le moment. Utilisez l’inscription par e-mail.",
    };
  }
}
