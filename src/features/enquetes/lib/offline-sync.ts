/**
 * Helpers hors-ligne (testables sans DOM).
 * La file locale côté navigateur utilisera IndexedDB / localStorage.
 */

export type OfflineDraft = {
  enqueteId: string;
  idempotencyKey: string;
  answers: Record<string, unknown>;
  createdAt: string;
};

export function createIdempotencyKey(enqueteId: string, deviceId: string, seq: number): string {
  return `offline:${enqueteId}:${deviceId}:${seq}:${Date.now()}`;
}

export function mergeOfflineQueue(
  existing: OfflineDraft[],
  incoming: OfflineDraft,
): { queue: OfflineDraft[]; duplicate: boolean } {
  if (existing.some((d) => d.idempotencyKey === incoming.idempotencyKey)) {
    return { queue: existing, duplicate: true };
  }
  return { queue: [...existing, incoming], duplicate: false };
}

export function markDraftSynced(
  queue: OfflineDraft[],
  key: string,
): OfflineDraft[] {
  return queue.filter((d) => d.idempotencyKey !== key);
}
