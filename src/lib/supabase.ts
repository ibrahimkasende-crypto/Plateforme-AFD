import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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

