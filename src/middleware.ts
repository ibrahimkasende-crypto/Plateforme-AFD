import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAuthPage(pathname: string): boolean {
  return (
    pathname === "/connexion" ||
    pathname === "/mot-de-passe-oublie" ||
    pathname === "/nouveau-mot-de-passe" ||
    pathname === "/auth/reset-password"
  );
}

/**
 * Middleware Supabase SSR — uniquement chemins auth/admin.
 * /api/health n’est PAS dans le matcher (aucune auth / redirect / rewrite).
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ceinture + bretelles : jamais toucher au health check.
  if (pathname === "/api/health" || pathname.startsWith("/api/health/")) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-afd-pathname", pathname);

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const env = getSupabasePublicEnv();

  if (!env) {
    if (isAdminPath(pathname)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/connexion";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({
          request: { headers: requestHeaders },
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminPath(pathname) && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/connexion";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage(pathname) && user && pathname === "/connexion") {
    // Pas de redirect auto : un compte sans profil doit pouvoir rester.
  }

  return supabaseResponse;
}

export const config = {
  // Matcher restrictif : /api/health, assets et pages publiques hors scope.
  matcher: [
    "/admin",
    "/admin/:path*",
    "/connexion",
    "/mot-de-passe-oublie",
    "/nouveau-mot-de-passe",
    "/auth/reset-password",
  ],
};
