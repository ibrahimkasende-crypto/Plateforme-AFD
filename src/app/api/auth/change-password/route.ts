import { createServerClient } from "@supabase/ssr";
import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import type { Database } from "@/types/database.types";
import { validatePasswordPolicy } from "@/lib/auth/password-policy";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  currentPassword: z.string().min(1).max(200).optional(),
  password: z.string().min(12).max(200),
  confirmPassword: z.string().min(12).max(200),
});

/**
 * Changement de mot de passe volontaire (API runtime Hostinger).
 */
export async function POST(request: NextRequest) {
  const env = getSupabasePublicEnv();
  if (!env) {
    return NextResponse.json(
      { ok: false, message: "Supabase non configuré." },
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
      { ok: false, message: "Vérifiez les champs du formulaire." },
      { status: 400 },
    );
  }

  const { password, confirmPassword, currentPassword } = parsed.data;
  if (password !== confirmPassword) {
    return NextResponse.json(
      { ok: false, message: "Les mots de passe ne correspondent pas." },
      { status: 400 },
    );
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

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    return jsonWithCookies(
      { ok: false, message: "Session expirée. Reconnectez-vous." },
      401,
    );
  }

  const { data: profile } = await supabase
    .from("profils_administrateurs" as never)
    .select("id, nom_complet, prenom, nom_famille, email")
    .eq("id", user.id)
    .maybeSingle();

  const profileRow = (profile || null) as {
    nom_complet?: string | null;
    prenom?: string | null;
    nom_famille?: string | null;
  } | null;

  const policy = validatePasswordPolicy(password, {
    email: user.email,
    displayName: profileRow?.nom_complet,
    firstName: profileRow?.prenom,
    lastName: profileRow?.nom_famille,
  });
  if (!policy.ok) {
    return jsonWithCookies(
      { ok: false, message: policy.message ?? "Mot de passe invalide." },
      400,
    );
  }

  if (currentPassword) {
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (reauthError) {
      return jsonWithCookies(
        { ok: false, message: "Mot de passe actuel incorrect." },
        400,
      );
    }
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    const lowered = (error.message || "").toLowerCase();
    let message = "Le mot de passe n’a pas pu être mis à jour. Réessayez.";
    if (lowered.includes("same") || lowered.includes("identical")) {
      message = "Le nouveau mot de passe doit être différent de l’actuel.";
    } else if (lowered.includes("weak") || lowered.includes("short")) {
      message = "Mot de passe trop faible selon les règles Auth.";
    }
    console.error("[api/auth/change-password]", {
      at: new Date().toISOString(),
      code: error.status || error.code || "update_failed",
      msgHash: createHash("sha256")
        .update(error.message || "")
        .digest("hex")
        .slice(0, 8),
    });
    return jsonWithCookies({ ok: false, message }, 400);
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

  return jsonWithCookies({
    ok: true,
    message: "Mot de passe mis à jour.",
    next: "/admin",
  });
}
