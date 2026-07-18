import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

/**
 * Client serveur « sûr » pour les pages publiques.
 * Retourne `null` si Supabase n’est pas configuré — la page ne plante pas.
 */
export async function createClientSafe() {
  const env = getSupabasePublicEnv();
  if (!env) return null;

  const cookieStore = await cookies();

  return createServerClient<Database>(env.url, env.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Lecture seule possible en Server Component.
        }
      },
    },
  });
}
