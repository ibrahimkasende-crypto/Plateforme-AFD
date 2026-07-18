import { RDC_PROVINCE_PATHS } from "@/features/intervention-zones/data/rdc-province-paths";

function normalizeLabel(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Alias déjà normalisés → id SVG. */
const ALIASES: Record<string, string> = {
  kinshasa: "CDKN",
  "kinshasa city": "CDKN",
  "ville de kinshasa": "CDKN",
  "kongo central": "CDBC",
  "bas congo": "CDBC",
  "nord kivu": "CDNK",
  "sud kivu": "CDSK",
  "kasai occidental": "CDKC",
  "haut katanga": "CDHK",
  "haut lomami": "CDHL",
  "haut uele": "CDHU",
  "bas uele": "CDBU",
  "nord ubangi": "CDNU",
  "sud ubangi": "CDSU",
  equateur: "CDEQ",
  "mai ndombe": "CDMN",
};

const BY_NORMALIZED_NAME = new Map<string, string>();

for (const province of RDC_PROVINCE_PATHS) {
  BY_NORMALIZED_NAME.set(normalizeLabel(province.name), province.id);
}

for (const [alias, id] of Object.entries(ALIASES)) {
  BY_NORMALIZED_NAME.set(alias, id);
}

const SORTED_LABELS = [...BY_NORMALIZED_NAME.entries()].sort(
  (a, b) => b[0].length - a[0].length,
);

/** Associe une localisation texte (projet) à un id province SVG, ou null. */
export function matchLocationToProvinceId(
  location: string | null | undefined,
): string | null {
  if (!location?.trim()) return null;
  const normalized = normalizeLabel(location);
  if (!normalized) return null;

  const exact = BY_NORMALIZED_NAME.get(normalized);
  if (exact) return exact;

  for (const [label, id] of SORTED_LABELS) {
    if (normalized.includes(label)) {
      return id;
    }
  }

  return null;
}

export function getProvincePathById(id: string) {
  return RDC_PROVINCE_PATHS.find((province) => province.id === id) ?? null;
}
