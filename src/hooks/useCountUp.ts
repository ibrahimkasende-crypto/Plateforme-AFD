// =============================================================
// useCountUp — Anime un nombre de 0 jusqu'à `target` lorsque
// `demarrer` passe à true (ex. déclenché par useInView).
// Basé sur requestAnimationFrame natif (aucune dépendance ajoutée).
// Respecte prefers-reduced-motion : affiche directement la valeur
// finale, sans animation.
// =============================================================

import { useEffect, useState } from 'react';

export function useCountUp(target: number, demarrer: boolean, dureeMs = 1500): number {
  const [valeur, setValeur] = useState(0);

  useEffect(() => {
    if (!demarrer) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValeur(target);
      return;
    }

    let debut: number | null = null;
    let frameId: number;

    function etape(horodatage: number) {
      if (debut === null) debut = horodatage;
      const progression = Math.min((horodatage - debut) / dureeMs, 1);
      // Easing « ease-out » pour un ralentissement naturel en fin de comptage
      const progressionAdoucie = 1 - Math.pow(1 - progression, 3);
      setValeur(Math.round(progressionAdoucie * target));
      if (progression < 1) {
        frameId = requestAnimationFrame(etape);
      }
    }

    frameId = requestAnimationFrame(etape);
    return () => cancelAnimationFrame(frameId);
  }, [demarrer, target, dureeMs]);

  return valeur;
}
