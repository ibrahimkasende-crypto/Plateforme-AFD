/**
 * Stratégie centralisée d’URL d’images Supabase Storage.
 * Utilise les transformations Storage si disponibles, sinon l’URL originale
 * (optimisée ensuite par next/image).
 */

export type ImageVariant = "thumbnail" | "card" | "content" | "hero";

const VARIANT_WIDTH: Record<ImageVariant, number> = {
  thumbnail: 320,
  card: 640,
  content: 960,
  hero: 1600,
};

const VARIANT_QUALITY: Record<ImageVariant, number> = {
  thumbnail: 70,
  card: 75,
  content: 80,
  hero: 82,
};

const STORAGE_PUBLIC_MARKER = "/storage/v1/object/public/";
const STORAGE_SIGN_MARKER = "/storage/v1/object/sign/";
const STORAGE_RENDER_MARKER = "/storage/v1/render/image/public/";

export function getVariantWidth(variant: ImageVariant): number {
  return VARIANT_WIDTH[variant];
}

export function getVariantQuality(variant: ImageVariant): number {
  return VARIANT_QUALITY[variant];
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

/**
 * Construit une URL optimisée pour une image Storage publique.
 * - URLs signées : non transformées (évite de casser la signature).
 * - Chemins locaux `/…` : inchangés.
 * - Transformations : `/storage/v1/render/image/public/...` + width/quality.
 */
export function getSupabaseImageUrl(
  src: string | null | undefined,
  options?: {
    variant?: ImageVariant;
    width?: number;
    quality?: number;
    /** Force l’original (pas de render transform). */
    original?: boolean;
  },
): string {
  if (!src) return "";
  const variant = options?.variant ?? "card";
  const width = options?.width ?? VARIANT_WIDTH[variant];
  const quality = options?.quality ?? VARIANT_QUALITY[variant];

  if (!isHttpUrl(src)) return src;
  if (options?.original) return src;

  // Transformations Storage optionnelles (plan Pro+). Sinon next/image optimise l’original.
  const transformEnabled =
    process.env.NEXT_PUBLIC_SUPABASE_IMAGE_TRANSFORM === "true";
  if (!transformEnabled) return src;

  // Ne pas transformer les URLs signées
  if (src.includes(STORAGE_SIGN_MARKER)) return src;

  // Déjà une URL render
  if (src.includes(STORAGE_RENDER_MARKER)) {
    return appendTransformParams(src, width, quality);
  }

  const publicIdx = src.indexOf(STORAGE_PUBLIC_MARKER);
  if (publicIdx === -1) return src;

  try {
    const url = new URL(src);
    const after = url.pathname.split(STORAGE_PUBLIC_MARKER)[1];
    if (!after) return src;
    url.pathname = `${STORAGE_RENDER_MARKER}${after}`;
    url.searchParams.set("width", String(width));
    url.searchParams.set("quality", String(quality));
    url.searchParams.set("resize", "contain");
    return url.toString();
  } catch {
    return src;
  }
}

function appendTransformParams(src: string, width: number, quality: number) {
  try {
    const url = new URL(src);
    if (!url.searchParams.has("width")) {
      url.searchParams.set("width", String(width));
    }
    if (!url.searchParams.has("quality")) {
      url.searchParams.set("quality", String(quality));
    }
    return url.toString();
  } catch {
    return src;
  }
}

/** sizes Tailwind-friendly pour variantes courantes. */
export const IMAGE_SIZES = {
  thumbnail: "320px",
  card: "(max-width: 768px) 84vw, 340px",
  content: "(max-width: 768px) 100vw, 960px",
  hero: "100vw",
} as const;
