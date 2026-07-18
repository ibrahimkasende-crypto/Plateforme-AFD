/**
 * Estime si le pointeur survole une surface blanche / très claire
 * afin d’amplifier la teinte bleu ciel de l’effet.
 */
export function sampleSurfaceWhiteness(clientX: number, clientY: number): number {
  const el = document.elementFromPoint(clientX, clientY);
  if (!el) return 0.35;

  let node: Element | null = el;
  for (let depth = 0; depth < 8 && node; depth += 1) {
    const style = getComputedStyle(node);
    const parsed = parseCssColor(style.backgroundColor);
    if (!parsed) {
      node = node.parentElement;
      continue;
    }

    const { r, g, b, a } = parsed;
    if (a < 0.12) {
      node = node.parentElement;
      continue;
    }

    return whitenessScore(r, g, b);
  }

  const bodyBg = parseCssColor(getComputedStyle(document.body).backgroundColor);
  if (!bodyBg || bodyBg.a < 0.12) return 0.55;
  return whitenessScore(bodyBg.r, bodyBg.g, bodyBg.b);
}

function whitenessScore(r: number, g: number, b: number): number {
  const avg = (r + g + b) / 3;
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  const neutral = 1 - Math.min(1, spread / 55);
  const light = Math.min(1, Math.max(0, (avg - 180) / 75));
  // Surfaces très blanches → ~1 ; gris clair → moyen ; foncé → 0
  return Math.min(1, light * (0.55 + neutral * 0.45));
}

function parseCssColor(
  value: string,
): { r: number; g: number; b: number; a: number } | null {
  if (!value || value === "transparent") return null;
  const match = value.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i,
  );
  if (!match) return null;
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  };
}
