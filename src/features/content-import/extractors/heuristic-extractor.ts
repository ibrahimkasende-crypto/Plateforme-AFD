import { FIELD_CATALOG } from "@/features/content-import/field-catalog";
import type {
  ContentEntityType,
  ExtractedContentField,
  FieldConfidence,
} from "@/features/content-import/types";

function confidenceFromScore(score: number, hasValue: boolean): FieldConfidence {
  if (!hasValue) return "missing";
  if (score >= 0.75) return "recognized";
  if (score >= 0.4) return "uncertain";
  return "missing";
}

function cleanCapture(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .replace(/^[:\-–\s]+/, "")
    .trim()
    .slice(0, 2000);
}

function guessTitleFromText(text: string): string | null {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length >= 8 && l.length <= 140);
  const candidate = lines.find(
    (l) =>
      !/^(page|confidential|afd|alliance)/i.test(l) &&
      /[A-Za-zÀ-ÿ]/.test(l),
  );
  return candidate ?? null;
}

function normalizeDate(value: string): string {
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return value;
  const fr = value.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/);
  if (!fr) return value;
  const d = fr[1]!.padStart(2, "0");
  const m = fr[2]!.padStart(2, "0");
  let y = fr[3]!;
  if (y.length === 2) y = `20${y}`;
  return `${y}-${m}-${d}`;
}

function normalizeBudget(value: string): string {
  return value.replace(/\s/g, "").replace(",", ".").replace(/[^\d.]/g, "");
}

function mapStatus(value: string): string {
  const v = value.toLowerCase();
  if (/termin|achev|cl[ôo]tur/.test(v)) return "termine";
  if (/futur|planifi|pr[ée]vu/.test(v)) return "futur";
  return "en_cours";
}

/**
 * Analyse heuristique du texte OCR / natif → champs structurés.
 * Remplaceable plus tard par un LLM sans changer le contrat.
 */
export function extractContentFields(
  entityType: ContentEntityType,
  fullText: string,
): ExtractedContentField[] {
  const catalog = FIELD_CATALOG[entityType] ?? FIELD_CATALOG.document;
  const text = fullText.replace(/\r/g, "").trim();
  const fields: ExtractedContentField[] = [];

  for (const def of catalog) {
    let value = "";
    let score = 0;
    let sourceHint: string | undefined;

    for (const pattern of def.patterns) {
      const match = text.match(pattern);
      if (!match) continue;
      const captured =
        match[2] && def.key === "gps"
          ? `${match[1]}, ${match[2]}`
          : (match[1] ?? match[0]);
      if (!captured) continue;
      value = cleanCapture(captured);
      score = Math.max(score, pattern.flags.includes("i") ? 0.82 : 0.78);
      sourceHint = pattern.source.slice(0, 80);
      break;
    }

    if (def.key === "titre" && !value) {
      const guess = guessTitleFromText(text);
      if (guess) {
        value = guess;
        score = 0.55;
        sourceHint = "première ligne significative";
      }
    }

    if (def.key === "description" && !value && text.length > 80) {
      value = cleanCapture(text.slice(0, 500));
      score = 0.45;
      sourceHint = "extrait début de document";
    }

    if (def.key === "contenu" && !value && text.length > 80) {
      value = cleanCapture(text.slice(0, 1500));
      score = 0.5;
      sourceHint = "corps du document";
    }

    if ((def.key === "date_debut" || def.key === "date_fin" || def.key === "activity_date" || def.key === "date_publication") && value) {
      value = normalizeDate(value);
    }

    if (def.key === "budget" && value) {
      value = normalizeBudget(value);
      score = Math.max(score, 0.8);
    }

    if (def.key === "statut" && value) {
      value = mapStatus(value);
    }

    if (def.key === "beneficiaires" && value) {
      value = value.replace(/\s/g, "");
    }

    fields.push({
      key: def.key,
      label: def.label,
      value,
      score,
      confidence: confidenceFromScore(score, Boolean(value)),
      sourceHint,
    });
  }

  return fields;
}

export function detectLanguageHint(text: string): string {
  const sample = text.slice(0, 2000).toLowerCase();
  const frHits = (sample.match(/\b(le|la|les|des|pour|avec|projet|programme|bénéficiaires)\b/g) ?? []).length;
  const enHits = (sample.match(/\b(the|and|project|program|beneficiaries|with)\b/g) ?? []).length;
  if (enHits > frHits + 3) return "en";
  return "fr";
}
