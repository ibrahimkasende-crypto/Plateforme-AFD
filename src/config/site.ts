export const siteConfig = {
  name: "Alliance des Femmes pour le Développement",
  shortName: "AFD",
  appName: "Plateforme-ADF",
  description:
    "Plateforme institutionnelle de l’Alliance des Femmes pour le Développement — ONG nationale congolaise engagée dans les urgences humanitaires, le développement, la santé, la nutrition, le WASH, la protection et le leadership féminin.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fr-CD",
  contact: {
    email: "contact@afd-rdc.org",
    phone: "+243 000 000 000",
    address: "République Démocratique du Congo",
  },
  social: {
    facebook: "",
    linkedin: "",
    twitter: "",
    youtube: "",
  },
  currencies: ["CDF", "USD", "EUR"] as const,
  defaultCurrency: "USD" as const,
  supportTypes: [
    "don_general",
    "soutien_programme",
    "soutien_projet",
    "soutien_urgence",
    "partenariat_institutionnel",
    "contribution_nature",
  ] as const,
} as const;

export type SupportType = (typeof siteConfig.supportTypes)[number];
export type AllowedCurrency = (typeof siteConfig.currencies)[number];
