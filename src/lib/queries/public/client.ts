import { createClientSafe } from "@/lib/supabase/safe";

export const DEFAULT_PAGE_SIZE = 12;

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export async function withClient<T>(
  fallback: T,
  run: (
    client: NonNullable<Awaited<ReturnType<typeof createClientSafe>>>,
  ) => Promise<T>,
): Promise<T> {
  try {
    const client = await createClientSafe();
    if (!client) return fallback;
    return await run(client);
  } catch {
    return fallback;
  }
}

export function emptyPaginatedResult<T>(
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): PaginatedResult<T> {
  return {
    items: [],
    total: 0,
    page,
    pageSize,
    totalPages: 0,
  };
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number | null,
  page: number,
  pageSize: number,
): PaginatedResult<T> {
  const safeTotal = total ?? items.length;
  return {
    items,
    total: safeTotal,
    page,
    pageSize,
    totalPages: safeTotal > 0 ? Math.ceil(safeTotal / pageSize) : 0,
  };
}

export function sanitizeSearchQuery(q?: string): string | undefined {
  const trimmed = q?.trim();
  if (!trimmed) return undefined;
  return trimmed.replace(/[%_,]/g, " ").slice(0, 120);
}

export function applyTextSearch<
  Q extends {
    or: (filters: string) => Q;
  },
>(query: Q, q: string | undefined, columns: string[]): Q {
  if (!q) return query;
  const pattern = `%${q}%`;
  const filters = columns.map((column) => `${column}.ilike.${pattern}`).join(",");
  return query.or(filters);
}

export function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function parseQuery(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}
