export const ACTIVITY_CATEGORIES = [
  "Formations",
  "Sensibilisations",
  "Distributions",
  "Réunions",
  "Missions",
  "Autres",
] as const;

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

export const RDC_PROVINCES = [
  "Kinshasa",
  "Kongo-Central",
  "Kwango",
  "Kwilu",
  "Mai-Ndombe",
  "Équateur",
  "Mongala",
  "Nord-Ubangi",
  "Sud-Ubangi",
  "Tshuapa",
  "Tshopo",
  "Bas-Uele",
  "Haut-Uele",
  "Ituri",
  "Nord-Kivu",
  "Sud-Kivu",
  "Maniema",
  "Haut-Katanga",
  "Lualaba",
  "Haut-Lomami",
  "Tanganyika",
  "Lomami",
  "Sankuru",
  "Kasaï",
  "Kasaï-Central",
  "Kasaï-Oriental",
] as const;

export type BeneficiaryMonthRow = {
  id: string;
  mois: string;
  province: string;
  femmes: number;
  hommes: number;
  enfants: number;
  jeunes: number;
  total: number;
  is_demo: boolean;
};

export type ActivityMonthRow = {
  id: string | null;
  mois: string;
  category: ActivityCategory;
  value: number;
  is_demo: boolean;
};

export type BudgetMonthRow = {
  id: string | null;
  mois: string;
  prevu: number;
  depense: number;
  currency: string;
  is_demo: boolean;
};

export function toMonthStart(ym: string): string {
  const m = ym.trim().slice(0, 7);
  if (!/^\d{4}-\d{2}$/.test(m)) {
    throw new Error("Mois invalide (attendu AAAA-MM).");
  }
  return `${m}-01`;
}

export function currentYearMonth(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
