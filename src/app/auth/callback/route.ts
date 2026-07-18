import { NextResponse, type NextRequest } from "next/server";
import { subscribeToNewsletter } from "@/features/newsletter/services/newsletter.service";
import { createClient } from "@/lib/supabase/server";

function safeNext(next: string | null, fallback: string): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }
  return next;
}

/**
 * Callback Supabase Auth (magic link / reset password / OAuth).
 * Avec `newsletter=1` : récupère l’e-mail Google, inscrit à la newsletter, puis déconnecte.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const forNewsletter = searchParams.get("newsletter") === "1";
  const next = safeNext(searchParams.get("next"), forNewsletter ? "/" : "/admin");

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        if (forNewsletter) {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          const email = user?.email?.trim();
          if (!user || !email) {
            await supabase.auth.signOut();
            return NextResponse.redirect(
              new URL(`${next}?newsletter=missing_email`, origin),
            );
          }

          const meta = user.user_metadata ?? {};
          const firstName =
            typeof meta.given_name === "string"
              ? meta.given_name
              : typeof meta.full_name === "string"
                ? meta.full_name.split(" ")[0]
                : typeof meta.name === "string"
                  ? meta.name.split(" ")[0]
                  : undefined;

          try {
            const result = await subscribeToNewsletter({
              email,
              firstName,
              preferences: [],
              consent: true,
              source: "google_oauth",
            });

            // Session Google publique : on ne la conserve pas (newsletter seulement).
            await supabase.auth.signOut();

            const status =
              result.status === "already_subscribed" ? "already" : "subscribed";
            const redirectUrl = new URL(next, origin);
            redirectUrl.searchParams.set("newsletter", status);
            return NextResponse.redirect(redirectUrl);
          } catch {
            await supabase.auth.signOut();
            const redirectUrl = new URL(next, origin);
            redirectUrl.searchParams.set("newsletter", "error");
            return NextResponse.redirect(redirectUrl);
          }
        }

        return NextResponse.redirect(new URL(next, origin));
      }
    } catch {
      // fallthrough
    }
  }

  if (forNewsletter) {
    return NextResponse.redirect(
      new URL(`${safeNext(searchParams.get("next"), "/")}?newsletter=error`, origin),
    );
  }

  return NextResponse.redirect(
    new URL("/connexion?erreur=callback", origin),
  );
}
