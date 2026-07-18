"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

export type HorizontalScrollState = {
  canScrollPrev: boolean;
  canScrollNext: boolean;
  progress: number;
  currentIndex: number;
  total: number;
  scrollByPage: (direction: -1 | 1) => void;
};

export function useHorizontalScrollState(
  ref: RefObject<HTMLElement | null>,
  itemCount: number,
): HorizontalScrollState {
  const [state, setState] = useState({
    canScrollPrev: false,
    canScrollNext: false,
    progress: 0,
    currentIndex: 0,
  });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft;
    const progress = max > 0 ? Math.min(1, Math.max(0, left / max)) : 0;
    const approxIndex =
      itemCount <= 1
        ? 0
        : Math.min(
            itemCount - 1,
            Math.round((left / Math.max(el.scrollWidth, 1)) * itemCount),
          );
    setState({
      canScrollPrev: left > 4,
      canScrollNext: left < max - 4,
      progress,
      currentIndex: approxIndex,
    });
  }, [itemCount, ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, update]);

  const scrollByPage = useCallback(
    (direction: -1 | 1) => {
      const el = ref.current;
      if (!el) return;
      const amount = Math.max(el.clientWidth * 0.85, 240);
      el.scrollBy({ left: direction * amount, behavior: "smooth" });
    },
    [ref],
  );

  return {
    ...state,
    total: itemCount,
    scrollByPage,
  };
}
