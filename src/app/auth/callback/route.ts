import { NextResponse, type NextRequest } from "next/server";
import { safeAuthNext } from "@/lib/auth/safe-auth-next";
import { NEWSLETTER_OAUTH_INTENT_COOKIE } from "@/lib/newsletter/google-oauth";
import { createClient } from "@/lib/supabase/server";

function clearNewsletterIntentCookie(response: NextResponse) {
  response.cookies.set(NEWSLETTER_OAUTH_INTENT_COOKIE, "", {
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
}

/**
 * Callback Supabase Auth (magic link / reset password / OAuth).
 *
 * Flux newsletter (`newsletter=1`) :
 * - échange le code contre une session ;
 * - ne crée aucun rôle / profil admin ;
 * - ne s’inscrit pas encore (consentement côté UI) ;
 * - redirige vers `/?newsletter=google-success` (ou `next` interne sûr).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const errorDescription = searchParams.get("error_description");
  const errorCode = searchParams.get("error");
  const intentCookie =
    request.cookies.get(NEWSLETTER_OAUTH_INTENT_COOKIE)?.value === "1";
  const forNewsletter =
    searchParams.get("newsletter") === "1" || intentCookie;

  const defaultNext = forNewsletter
    ? "/?newsletter=google-success"
    : "/admin";
  const next = safeAuthNext(searchParams.get("next"), defaultNext);

  if (errorCode || errorDescription) {
    if (forNewsletter) {
      const url = new URL("/", origin);
      url.searchParams.set("newsletter", "error");
      const response = NextResponse.redirect(url);
      clearNewsletterIntentCookie(response);
      return response;
    }
    return NextResponse.redirect(
      new URL("/connexion?erreur=callback", origin),
    );
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        if (forNewsletter) {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          const email =
            user?.email?.trim() ||
            (typeof user?.user_metadata?.email === "string"
              ? user.user_metadata.email.trim()
              : "");

          if (!user || !email) {
            await supabase.auth.signOut();
            const redirectUrl = new URL("/", origin);
            redirectUrl.searchParams.set("newsletter", "missing_email");
            const response = NextResponse.redirect(redirectUrl);
            clearNewsletterIntentCookie(response);
            return response;
          }

          // Session conservée uniquement pour préremplir l’e-mail + confirmer le consentement.
          const redirectUrl = new URL(next, origin);
          if (!redirectUrl.searchParams.has("newsletter")) {
            redirectUrl.searchParams.set("newsletter", "google-success");
          }
          const response = NextResponse.redirect(redirectUrl);
          clearNewsletterIntentCookie(response);
          return response;
        }

        return NextResponse.redirect(new URL(next, origin));
      }

      console.error("[auth/callback]", {
        step: "exchangeCodeForSession",
        forNewsletter,
        at: new Date().toISOString(),
        type: error.name || "AuthError",
      });
    } catch {
      console.error("[auth/callback]", {
        step: "exchange_exception",
        forNewsletter,
        at: new Date().toISOString(),
      });
    }
  }

  if (forNewsletter) {
    const errUrl = new URL(
      safeAuthNext(searchParams.get("next"), "/"),
      origin,
    );
    errUrl.searchParams.set("newsletter", "error");
    const response = NextResponse.redirect(errUrl);
    clearNewsletterIntentCookie(response);
    return response;
  }

  return NextResponse.redirect(
    new URL("/connexion?erreur=callback", origin),
  );
}
