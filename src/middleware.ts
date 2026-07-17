import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAuthPage(pathname: string): boolean {
  return (
    pathname === "/connexion" ||
    pathname === "/mot-de-passe-oublie" ||
    pathname === "/nouveau-mot-de-passe"
  );
}

/**
 * Middleware Supabase SSR :
 * - rafraîchit la session (cookies) ;
 * - bloque l’accès à /admin sans utilisateur authentifié.
 * La vérification profil/rôle/actif reste dans requireAdmin() (layout).
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    if (isAdminPath(request.nextUrl.pathname)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/connexion";
      loginUrl.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (isAdminPath(pathname) && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/connexion";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Utilisateur connecté sur page de connexion → laisser le layout/admin
  // décider via requireAdmin (profil actif requis).
  if (isAuthPage(pathname) && user && pathname === "/connexion") {
    const adminUrl = request.nextUrl.clone();
    const next = request.nextUrl.searchParams.get("next");
    adminUrl.pathname =
      next && next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
    adminUrl.search = "";
    // Ne redirige pas automatiquement ici : un compte sans profil
    // doit pouvoir rester sur /connexion après échec signIn.
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
