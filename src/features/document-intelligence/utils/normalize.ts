export type NormalizedAmount = {
  amount: number;
  currency: string | null;
  ambiguous: boolean;
  interpretations: string[];
};

export type NormalizedDate = {
  iso: string | null;
  ambiguous: boolean;
  interpretations: string[];
};

const PROVINCE_ALIASES: Record<string, string> = {
  "haut katanga": "Haut-Katanga",
  "haut-katanga": "Haut-Katanga",
  "kinshasa": "Kinshasa",
  "nord kivu": "Nord-Kivu",
  "nord-kivu": "Nord-Kivu",
  "sud kivu": "Sud-Kivu",
  "sud-kivu": "Sud-Kivu",
  "ituri": "Ituri",
  "tshopo": "Tshopo",
  "kasai": "Kasaï",
  "kasaï": "Kasaï",
  "kasai oriental": "Kasaï-Oriental",
  "kasai central": "Kasaï-Central",
};

export function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function normalizeOcrGlyphs(value: string): string {
  return value
    .replace(/[|]/g, "I")
    .replace(/[«»]/g, '"')
    .replace(/\u00a0/g, " ");
}

/**
 * Normalise un montant type `1.250,50 USD` → 1250.50 + USD.
 * Si plusieurs interprétations possibles, marque ambiguous=true.
 */
export function normalizeAmount(raw: string): NormalizedAmount {
  const cleaned = normalizeOcrGlyphs(collapseWhitespace(raw));
  const currencyMatch = cleaned.match(/\b(USD|EUR|CDF|FC|\$|€)\b/i);
  const currency = currencyMatch
    ? currencyMatch[1].toUpperCase().replace("$", "USD").replace("€", "EUR").replace("FC", "CDF")
    : null;

  const numberPart = cleaned
    .replace(/\b(USD|EUR|CDF|FC|\$|€)\b/gi, "")
    .replace(/[^\d,.\-]/g, "")
    .trim();

  const interpretations: string[] = [];
  let amount: number | null = null;
  let ambiguous = false;

  if (!numberPart) {
    return { amount: NaN, currency, ambiguous: true, interpretations: [] };
  }

  const hasComma = numberPart.includes(",");
  const hasDot = numberPart.includes(".");

  if (hasComma && hasDot) {
    // 1.250,50 → EU ; 1,250.50 → US
    if (numberPart.lastIndexOf(",") > numberPart.lastIndexOf(".")) {
      const eu = Number(numberPart.replace(/\./g, "").replace(",", "."));
      interpretations.push(String(eu));
      amount = eu;
    } else {
      const us = Number(numberPart.replace(/,/g, ""));
      interpretations.push(String(us));
      amount = us;
    }
  } else if (hasComma && !hasDot) {
    const parts = numberPart.split(",");
    if (parts[1]?.length === 3 && parts.length === 2) {
      // 1,250 ambigu : milliers US ou décimal EU incomplet
      const asThousands = Number(parts.join(""));
      const asDecimal = Number(`${parts[0]}.${parts[1]}`);
      interpretations.push(String(asThousands), String(asDecimal));
      ambiguous = true;
      amount = asThousands;
    } else {
      amount = Number(numberPart.replace(",", "."));
      interpretations.push(String(amount));
    }
  } else if (hasDot && !hasComma) {
    const parts = numberPart.split(".");
    if (parts.length === 2 && parts[1].length === 3) {
      const asThousands = Number(parts.join(""));
      const asDecimal = Number(numberPart);
      interpretations.push(String(asThousands), String(asDecimal));
      ambiguous = true;
      amount = asDecimal;
    } else {
      amount = Number(numberPart);
      interpretations.push(String(amount));
    }
  } else {
    amount = Number(numberPart);
    interpretations.push(String(amount));
  }

  if (amount === null || Number.isNaN(amount)) {
    return { amount: NaN, currency, ambiguous: true, interpretations };
  }

  return { amount, currency, ambiguous, interpretations };
}

export function normalizePercentage(raw: string): {
  value: number;
  ambiguous: boolean;
} {
  const cleaned = collapseWhitespace(raw).replace("%", "").replace(",", ".");
  const value = Number(cleaned);
  return { value, ambiguous: Number.isNaN(value) };
}

/**
 * Dates FR/ISO courantes. Ambiguïté si plusieurs formats valides divergent.
 */
export function normalizeDate(raw: string): NormalizedDate {
  const cleaned = collapseWhitespace(raw);
  const interpretations: string[] = [];

  const iso = cleaned.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const d = `${iso[1]}-${iso[2]}-${iso[3]}`;
    return { iso: d, ambiguous: false, interpretations: [d] };
  }

  const fr = cleaned.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/);
  if (fr) {
    const day = Number(fr[1]);
    const month = Number(fr[2]);
    const year = fr[3];
    if (day > 12) {
      const d = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return { iso: d, ambiguous: false, interpretations: [d] };
    }
    if (month > 12) {
      const d = `${year}-${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}`;
      return { iso: d, ambiguous: false, interpretations: [d] };
    }
    const a = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const b = `${year}-${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}`;
    interpretations.push(a, b);
    return { iso: a, ambiguous: a !== b, interpretations };
  }

  return { iso: null, ambiguous: true, interpretations };
}

export function normalizeProvince(raw: string): string | null {
  const key = collapseWhitespace(raw).toLowerCase();
  if (!key) return null;
  return PROVINCE_ALIASES[key] ?? collapseWhitespace(raw);
}

export function normalizeReference(raw: string): string {
  return collapseWhitespace(raw).toUpperCase().replace(/\s+/g, "");
}
