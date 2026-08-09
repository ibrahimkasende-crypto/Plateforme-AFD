/** Projet Supabase AFD mandaté (auth + data). */
export const MANDATED_SUPABASE_URL =
  "https://mxxuxnoqnwjygawvvhcb.supabase.co";
export const MANDATED_SUPABASE_PROJECT_REF = "mxxuxnoqnwjygawvvhcb";

/**
 * Clé publishable publique du projet mandaté.
 * Les clés anon/publishable sont conçues pour le client ; ce fallback
 * évite les déploiements Hostinger où la variable est absente, tronquée
 * ou remplacée par une mauvaise valeur au build.
 */
export const MANDATED_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_UobTtcCx8UtlUsjI--F5UQ_3cAyRSAx";

/**
 * Lecture dynamique — évite l’inline build-time Next.js des NEXT_PUBLIC_*
 * qui casse Auth sur Hostinger quand les variables sont ajoutées après le build.
 */
function readEnv(name: string): string | undefined {
  try {
    const value = process.env[name];
    if (typeof value !== "string") return undefined;
    let cleaned = value.replace(/^\uFEFF/, "").trim();
    // Hostinger / imports .env collent parfois des guillemets ou espaces
    cleaned = cleaned.replace(/[\r\n\t ]+/g, "");
    if (
      (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("'") && cleaned.endsWith("'"))
    ) {
      cleaned = cleaned.slice(1, -1);
    }
    cleaned = cleaned.trim();
    return cleaned || undefined;
  } catch {
    return undefined;
  }
}

export function looksLikePublicSupabaseKey(key: string): boolean {
  return (
    key.startsWith("eyJ") || // anon JWT classique
    key.startsWith("sb_publishable_")
  );
}

export function describePublicKey(key: string | undefined): {
  kind: string;
  prefix: string;
  length: number;
} {
  if (!key) return { kind: "missing", prefix: "", length: 0 };
  const kind = key.startsWith("eyJ")
    ? "anon_jwt"
    : key.startsWith("sb_publishable_")
      ? "publishable"
      : key.startsWith("sb_secret_")
        ? "secret"
        : "unknown";
  return { kind, prefix: key.slice(0, 16), length: key.length };
}

/**
 * Résout l’URL et la clé publique Supabase.
 * - Préfère les variables serveur (non inlinées au build Hostinger)
 * - Ignore secrets / clés mal formées
 * - Fallback publishable du projet mandaté en production
 */
export function getSupabasePublicEnv(): { url: string; key: string } | null {
  const rawUrl = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  // Ordre : clés serveur runtime d’abord (Hostinger), puis NEXT_PUBLIC_
  const candidates = [
    readEnv("SUPABASE_ANON_KEY"),
    readEnv("SUPABASE_PUBLISHABLE_KEY"),
    readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  ].filter((k): k is string => Boolean(k));

  const valid = candidates.filter(looksLikePublicSupabaseKey);

  const appEnv = readEnv("NEXT_PUBLIC_APP_ENV");
  const isProd =
    process.env.NODE_ENV === "production" || appEnv === "production";

  let key = valid[0];
  if (!key && isProd) {
    key = MANDATED_SUPABASE_PUBLISHABLE_KEY;
  }
  if (!key) return null;

  const url = isProd
    ? MANDATED_SUPABASE_URL
    : rawUrl?.replace(/\/$/, "") || null;

  if (!url) return null;
  return { url, key };
}

export function getConfiguredSupabaseProjectRef(): string | null {
  const raw = readEnv("NEXT_PUBLIC_SUPABASE_URL") || "";
  const match = raw.match(/^https?:\/\/([a-z0-9]+)\.supabase\.co/i);
  return match?.[1] ?? null;
}
