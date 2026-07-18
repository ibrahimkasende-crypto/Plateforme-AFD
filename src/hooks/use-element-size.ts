"use client";

import { useEffect, useState, type RefObject } from "react";

export type ElementSize = {
  width: number;
  height: number;
};

/**
 * Observe la taille d’un élément et déclenche un reflow Recharts
 * après repli / ouverture de la sidebar.
 */
export function useElementSize<T extends HTMLElement>(
  ref: RefObject<T | null>,
): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ width, height });
      window.dispatchEvent(new Event("resize"));
    });

    observer.observe(node);
    setSize({
      width: node.clientWidth,
      height: node.clientHeight,
    });

    return () => observer.disconnect();
  }, [ref]);

  return size;
}
