import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export function createClient() {
  const env = getSupabasePublicEnv();

  if (!env) {
    throw new Error(
      "Supabase n’est pas configuré. Définissez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY (ou PUBLISHABLE_KEY).",
    );
  }

  return createBrowserClient<Database>(env.url, env.key);
}
