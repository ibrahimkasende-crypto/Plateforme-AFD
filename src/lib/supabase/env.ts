/**
 * Résout l’URL et la clé publique Supabase.
 * Accepte la clé classique `anon` (JWT eyJ…) ou la clé `publishable` (sb_publishable_…).
 */
export function getSupabasePublicEnv(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !key) return null;
  return { url, key };
}
