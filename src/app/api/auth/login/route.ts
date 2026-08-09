import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import type { Database } from "@/types/database.types";
import {
  describePublicKey,
  getSupabasePublicEnv,
} from "@/lib/supabase/env";
import { createHash } from "node:crypto";

const bodySchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200),
});

type ProfileRow = {
  id: string;
  email: string | null;
  actif: boolean | null;
  statut_compte?: string | null;
  must_change_password?: boolean | null;
};

/**
 * Connexion admin fiable sur Hostinger :
 * - lit les clés Supabase au runtime ;
 * - pose les cookies de session sur la réponse HTTP ;
 * - vérifie le profil avec le même client authentifié (pas un 2e client sans cookies).
 */
export async function POST(request: NextRequest) {
  const env = getSupabasePublicEnv();
  if (!env) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Supabase non configuré. Vérifiez les variables Hostinger puis Redeploy.",
      },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Requête invalide." },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Veuillez vérifier votre adresse e-mail et votre mot de passe.",
      },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase();
  const password = parsed.data.password;

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

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  function jsonWithCookies(
    body: Record<string, unknown>,
    status = 200,
  ): NextResponse {
    const res = NextResponse.json(body, { status });
    for (const item of cookieJar) {
      res.cookies.set(item.name, item.value, item.options);
    }
    return res;
  }

  if (error || !data.user) {
    const lowered = (error?.message || "").toLowerCase();
    let message =
      "Identifiants incorrects ou compte inaccessible. Vérifiez l’e-mail et le mot de passe.";

    // Ne pas utiliser status===401 : GoTrue renvoie aussi 401 pour mauvais mot de passe.
    const keyBroken =
      lowered.includes("invalid api key") ||
      lowered.includes("invalid jwt") ||
      lowered.includes("jwt malformed") ||
      lowered.includes("no api key found");

    const keyMeta = describePublicKey(env.key);
    const keyFingerprint = createHash("sha256")
      .update(env.key)
      .digest("hex")
      .slice(0, 10);

    if (keyBroken) {
      message =
        "Clé Supabase invalide sur Hostinger. Importez Deploy/hostinger.env (projet mxxux), puis Rebuild obligatoire.";
    } else if (
      lowered.includes("email not confirmed") ||
      error?.code === "email_not_confirmed"
    ) {
      message =
        "E-mail non confirmé dans Supabase Auth. Ouvrez le user et confirmez l’e-mail.";
    }

    console.error("[api/auth/login]", {
      at: new Date().toISOString(),
      code: error?.code || error?.status || "auth_failed",
      supabaseMessage: (error?.message || "").slice(0, 120),
      keyKind: keyMeta.kind,
      keyFingerprint,
    });

    return jsonWithCookies(
      {
        ok: false,
        message,
        ...(keyBroken
          ? {
              debug: {
                keyKind: keyMeta.kind,
                keyFingerprint,
                keyPrefix: keyMeta.prefix,
                supabaseMessage: (error?.message || "").slice(0, 80),
              },
            }
          : {}),
      },
      401,
    );
  }

  // Profil via le client déjà authentifié (évite un 2e client sans cookies de session)
  let profile: ProfileRow | null = null;
  const full = await supabase
    .from("profils_administrateurs" as never)
    .select("id, email, actif, statut_compte, must_change_password")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!full.error && full.data) {
    profile = full.data as unknown as ProfileRow;
  } else {
    const basic = await supabase
      .from("profils_administrateurs" as never)
      .select("id, email, actif")
      .eq("id", data.user.id)
      .maybeSingle();
    if (!basic.error && basic.data) {
      profile = {
        ...(basic.data as object),
        statut_compte: "actif",
        must_change_password: false,
      } as ProfileRow;
    }
  }

  if (!profile) {
    await supabase.auth.signOut();
    return jsonWithCookies({
      ok: false,
      message:
        "Aucun profil administrateur n’est associé à ce compte. Contactez la direction.",
    });
  }

  const statut = (profile.statut_compte || "").toLowerCase();
  const statutBloque =
    statut === "suspendu" ||
    statut === "desactive" ||
    statut === "disabled" ||
    statut === "inactive";

  if (!profile.actif || statutBloque) {
    await supabase.auth.signOut();
    return jsonWithCookies({
      ok: false,
      message: "Ce compte administrateur est désactivé.",
    });
  }

  try {
    await supabase
      .from("profils_administrateurs" as never)
      .update({ derniere_connexion: new Date().toISOString() } as never)
      .eq("id", data.user.id);
  } catch {
    // non bloquant
  }

  return jsonWithCookies({ ok: true, next: "/admin" });
}
