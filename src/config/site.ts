import { assets } from "@/config/assets";

export const siteConfig = {
  name: "Alliance des Femmes pour le Développement",
  shortName: "AFD ASBL",
  acronym: "AFD",
  appName: "Plateforme-AFD",
  country: "République démocratique du Congo",
  countryShort: "R.D. CONGO",
  brandLines: [
    "ALLIANCE DES FEMMES",
    "POUR LE DÉVELOPPEMENT",
    "R.D. CONGO",
  ] as const,
  description:
    "Plateforme institutionnelle de l’Alliance des Femmes pour le Développement — ONG nationale congolaise engagée dans les urgences humanitaires, le développement, la santé, la nutrition, le WASH, la protection et le leadership féminin.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fr-CD",
  logo: {
    src: assets.brand.logo,
    alt: "Logo officiel AFD — Alliance des Femmes pour le Développement",
    width: 64,
    height: 64,
  },
  routes: {
    home: "/",
    adhesion: "/adhesion",
    soutenir: "/soutenir",
    contact: "/contact",
  },
  contact: {
    email: "contact@afd-rdc.org",
    phone: "+243 000 000 000",
    address: "République démocratique du Congo",
  },
  social: {
    facebook: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
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
