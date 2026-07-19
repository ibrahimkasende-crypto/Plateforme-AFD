import { describe, expect, it } from "vitest";
import {
  availableBudget,
  canTransitionDepense,
  sumAmounts,
} from "@/features/finances/lib/finance-rules";
import {
  createIdempotencyKey,
  markDraftSynced,
  mergeOfflineQueue,
} from "@/features/enquetes/lib/offline-sync";

describe("finance rules", () => {
  it("calcule le disponible et refuse les transitions invalides", () => {
    expect(availableBudget(1000, 250)).toBe(750);
    expect(sumAmounts([{ amount: 10 }, { amount: "5" }])).toBe(15);
    expect(canTransitionDepense("soumise", "approuvee")).toBe(true);
    expect(canTransitionDepense("payee", "annulee")).toBe(false);
  });
});

describe("offline survey queue", () => {
  it("détecte les doublons d'idempotency key", () => {
    const key = createIdempotencyKey("11111111-1111-1111-1111-111111111111", "dev1", 1);
    const draft = {
      enqueteId: "11111111-1111-1111-1111-111111111111",
      idempotencyKey: key,
      answers: { q1: "a" },
      createdAt: new Date().toISOString(),
    };
    const first = mergeOfflineQueue([], draft);
    expect(first.duplicate).toBe(false);
    const second = mergeOfflineQueue(first.queue, draft);
    expect(second.duplicate).toBe(true);
    expect(markDraftSynced(first.queue, key)).toHaveLength(0);
  });
});
