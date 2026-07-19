"use client";

/**
 * Hook client pour le compteur messages non traités.
 * En SSR admin, le compteur principal vient du layout (badges).
 * Ce hook sert de point d’extension pour invalidation après actions.
 */
import { useCallback, useState } from "react";

export function useUnreadMessagesCount(initial: number | null = null) {
  const [count, setCount] = useState<number | null>(initial);

  const setFromServer = useCallback((value: number | null) => {
    setCount(value);
  }, []);

  const decrement = useCallback(() => {
    setCount((c) => (c == null || c <= 0 ? 0 : c - 1));
  }, []);

  return { count, setFromServer, decrement };
}
