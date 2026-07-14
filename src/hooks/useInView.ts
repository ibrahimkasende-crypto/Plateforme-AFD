// =============================================================
// useInView — Détecte qu'un élément entre dans le viewport.
// Basé sur IntersectionObserver natif (aucune dépendance ajoutée).
// Se déclenche une seule fois, puis cesse d'observer.
// Respecte prefers-reduced-motion : l'élément est considéré comme
// « visible » immédiatement, sans attendre le défilement.
// =============================================================

import { useEffect, useRef, useState } from 'react';

export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduitMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduitMotion) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.2, ...options });

    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}
