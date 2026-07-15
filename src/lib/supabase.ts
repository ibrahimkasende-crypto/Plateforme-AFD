import { createClient } from '@supabase/supabase-js';

const configuredSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const configuredSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// En développement sans .env, on conserve un client valide vers une origine
// injoignable afin que les pages publiques basculent sur leurs données de
// secours au lieu de faire échouer tout le rendu React au démarrage.
const supabaseUrl = configuredSupabaseUrl || 'https://supabase-not-configured.invalid';
const supabaseAnonKey = configuredSupabaseAnonKey || 'development-placeholder-anon-key';

export const isSupabaseConfigured = Boolean(configuredSupabaseUrl && configuredSupabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface QueryError {
  code?: string;
  message?: string;
}

function normalizeQueryError(error: unknown): QueryError {
  if (typeof error === 'object' && error !== null) {
    const candidate = error as Record<string, unknown>;
    return {
      code: typeof candidate.code === 'string' ? candidate.code : undefined,
      message: typeof candidate.message === 'string' ? candidate.message : undefined,
    };
  }

  return { message: String(error) };
}

/**
 * Exécute une requête Supabase avec des tentatives de reconnexion automatiques (retries).
 * Utile pour surmonter les coupures temporaires ou le démarrage à froid (cold start) de Supabase.
 */
export async function queryWithRetry<T>(
  queryFn: () => PromiseLike<{ data: T | null; error: QueryError | null }>,
  retries = 3,
  delayMs = 1500
): Promise<{ data: T | null; error: QueryError | null }> {
  let lastError: QueryError | null = null;
  for (let i = 0; i < retries; i++) {
    try {
      const result = await queryFn();
      if (!result.error) {
        return result;
      }
      lastError = normalizeQueryError(result.error);
      console.warn(`[Supabase query] Tentative ${i + 1} échouée. Nouvelle tentative dans ${delayMs}ms...`, result.error);
    } catch (e) {
      lastError = normalizeQueryError(e);
      console.warn(`[Supabase query] Tentative ${i + 1} a levé une exception. Nouvelle tentative dans ${delayMs}ms...`, e);
    }
    if (i < retries - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return { data: null, error: lastError };
}

