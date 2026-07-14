import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Exécute une requête Supabase avec des tentatives de reconnexion automatiques (retries).
 * Utile pour surmonter les coupures temporaires ou le démarrage à froid (cold start) de Supabase.
 */
export async function queryWithRetry<T>(
  queryFn: () => PromiseLike<{ data: T | null; error: any }>,
  retries = 3,
  delayMs = 1500
): Promise<{ data: T | null; error: any }> {
  let lastError = null;
  for (let i = 0; i < retries; i++) {
    try {
      const result = await queryFn();
      if (!result.error) {
        return result;
      }
      lastError = result.error;
      console.warn(`[Supabase query] Tentative ${i + 1} échouée. Nouvelle tentative dans ${delayMs}ms...`, result.error);
    } catch (e) {
      lastError = e;
      console.warn(`[Supabase query] Tentative ${i + 1} a levé une exception. Nouvelle tentative dans ${delayMs}ms...`, e);
    }
    if (i < retries - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return { data: null, error: lastError };
}

