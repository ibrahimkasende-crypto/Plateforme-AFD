import { createClient } from "@/lib/supabase/client";

export const NEWSLETTER_OAUTH_INTENT_COOKIE = "newsletter_oauth_intent";
export const NEWSLETTER_GOOGLE_SUCCESS_QUERY = "google-success";

function isGoogleNewsletterOAuthEnabled(): boolean {
  const raw = process.env.NEXT_PUBLIC_NEWSLETTER_GOOGLE_OAUTH_ENABLED;
  if (raw === "false" || raw === "0") return false;
  return true;
}

function humanizeOAuthError(raw: string | undefined): string {
  const text = (raw ?? "").toLowerCase();
  if (
    text.includes("provider is not enabled") ||
    text.includes("unsupported provider") ||
    text.includes("validation_failed")
  ) {
    return "La connexion Google n’est pas encore activée pour ce site. Inscrivez-vous avec votre adresse e-mail ci-dessous.";
  }
  if (text.includes("popup") || text.includes("blocked")) {
    return "La redirection Google a été bloquée. Autorisez la fenêtre ou utilisez l’inscription par e-mail.";
  }
  if (text.includes("network") || text.includes("fetch")) {
    return "Problème réseau. Vérifiez votre connexion puis réessayez.";
  }
  return "La connexion Google n’est pas disponible pour le moment. Utilisez l’inscription par e-mail.";
}

function markNewsletterOAuthIntent() {
  try {
    const secure =
      typeof window !== "undefined" && window.location.protocol === "https:"
        ? "; Secure"
        : "";
    document.cookie = `${NEWSLETTER_OAUTH_INTENT_COOKIE}=1; Path=/; Max-Age=600; SameSite=Lax${secure}`;
  } catch {
    // ignore
  }
}

/**
 * Démarre Google OAuth pour récupérer l’e-mail newsletter.
 * Retour attendu : /auth/callback → /?newsletter=google-success
 */
export async function startGoogleNewsletterOAuth(): Promise<
  { ok: true } | { ok: false; message: string }
> {
  if (!isGoogleNewsletterOAuthEnabled()) {
    return {
      ok: false,
      message:
        "L’inscription via Google est temporairement désactivée. Saisissez votre e-mail ci-dessous.",
    };
  }

  try {
    const supabase = createClient();
    const origin = window.location.origin;
    const next = `/?newsletter=${NEWSLETTER_GOOGLE_SUCCESS_QUERY}`;

    markNewsletterOAuthIntent();

    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}&newsletter=1`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        scopes: "openid email profile",
        skipBrowserRedirect: true,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      return { ok: false, message: humanizeOAuthError(error.message) };
    }

    if (!data.url) {
      return {
        ok: false,
        message:
          "Impossible de démarrer Google. Utilisez l’inscription par e-mail.",
      };
    }

    try {
      const probe = await fetch(data.url, {
        method: "GET",
        redirect: "manual",
        credentials: "omit",
      });
      const contentType = probe.headers.get("content-type") ?? "";
      if (
        contentType.includes("application/json") ||
        probe.status === 400 ||
        probe.status === 422
      ) {
        let msg = "";
        try {
          const body = (await probe.json()) as {
            msg?: string;
            message?: string;
          };
          msg = body.msg || body.message || "";
        } catch {
          msg = "";
        }
        return { ok: false, message: humanizeOAuthError(msg) };
      }
    } catch {
      // CORS / opaque : on poursuit la redirection.
    }

    window.location.assign(data.url);
    return { ok: true };
  } catch (err) {
    const raw =
      err instanceof Error
        ? err.message
        : typeof err === "string"
          ? err
          : undefined;
    return {
      ok: false,
      message: humanizeOAuthError(raw),
    };
  }
}

export function isNewsletterGoogleButtonVisible(): boolean {
  return isGoogleNewsletterOAuthEnabled();
}
