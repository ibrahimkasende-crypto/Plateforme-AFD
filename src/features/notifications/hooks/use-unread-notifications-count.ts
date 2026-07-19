"use client";

import { useCallback, useState } from "react";

export function useUnreadNotificationsCount(initial: number | null = null) {
  const [count, setCount] = useState<number | null>(initial);

  const setFromServer = useCallback((value: number | null) => {
    setCount(value);
  }, []);

  const decrement = useCallback(() => {
    setCount((c) => (c == null || c <= 0 ? 0 : c - 1));
  }, []);

  return { count, setFromServer, decrement };
}
