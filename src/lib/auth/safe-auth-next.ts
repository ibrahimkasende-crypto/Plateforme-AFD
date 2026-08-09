/**
 * Destinations internes sûres pour le callback OAuth.
 * Refuse les URL externes et les protocol-relative (`//…`).
 */
export function safeAuthNext(
  next: string | null | undefined,
  fallback: string,
): string {
  if (!next) return fallback;
  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }
  if (trimmed.includes("://") || trimmed.includes("\\")) {
    return fallback;
  }
  return trimmed;
}
