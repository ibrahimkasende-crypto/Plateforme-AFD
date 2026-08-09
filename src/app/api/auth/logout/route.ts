import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Déconnexion fiable sur Hostinger (cookies posés sur la réponse HTTP).
 */
export async function POST(request: NextRequest) {
  const env = getSupabasePublicEnv();
  if (!env) {
    return NextResponse.json({ ok: true, next: "/connexion" });
  }

  const cookieJar: Array<{
    name: string;
    value: string;
    options?: Parameters<NextResponse["cookies"]["set"]>[2];
  }> = [];

  const supabase = createServerClient<Database>(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieJar.push({ name, value, options });
        });
      },
    },
  });

  try {
    await supabase.auth.signOut();
  } catch {
    // on force quand même la purge des cookies
  }

  const res = NextResponse.json({ ok: true, next: "/connexion" });
  for (const item of cookieJar) {
    res.cookies.set(item.name, item.value, item.options);
  }

  // Purge défensive des cookies de session Supabase
  for (const cookie of request.cookies.getAll()) {
    if (
      cookie.name.includes("sb-") ||
      cookie.name.includes("supabase") ||
      cookie.name.startsWith("sb")
    ) {
      res.cookies.set(cookie.name, "", {
        path: "/",
        maxAge: 0,
      });
    }
  }

  return res;
}
