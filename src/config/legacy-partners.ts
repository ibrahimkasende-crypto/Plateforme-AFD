/**
 * Partenaires officiellement affichés sur afd-rdc.org
 * (section « Ils nous font confiance » / « Nos partenaires »).
 * Source : API publique Supabase de l’ancien site — 2026-07-18.
 * Ne pas y ajouter d’organisations absentes de cette source.
 */

export type LegacyPartnerRecord = {
  id: string;
  name: string;
  acronyme: string | null;
  slug: string;
  category: string | null;
  order: number;
  logoLocalPath: string;
  sourceLogoUrl: string;
  websiteUrl: null;
  description: null;
};

export const LEGACY_PARTNERS_SOURCE_URL = "https://afd-rdc.org/";

export const LEGACY_PARTNERS: readonly LegacyPartnerRecord[] = [
  {
    id: "4a552a59-f9cc-4460-8778-f98ec923762e",
    name: "MINISTERE DE LA SANTE PUBLIQUE, HYGIENE ET PREVOYANCE SOCIALE",
    acronyme: null,
    slug: "ministere-de-la-sante-publique-hygiene-et-prevoyance-sociale",
    category: "gouvernement",
    order: 1,
    logoLocalPath:
      "/images/afd/partenaires/ministere-de-la-sante-publique-hygiene-et-prevoyance-sociale.png",
    sourceLogoUrl:
      "https://ndkcywqihtnuoydwicrq.supabase.co/storage/v1/object/public/gallery/partenaires/1783517120866-design-sans-titre-13.png",
    websiteUrl: null,
    description: null,
  },
  {
    id: "1c2acb41-c94d-460e-8d3d-6152c383cd58",
    name: "CHWID",
    acronyme: "CHWID",
    slug: "chwid",
    category: "international",
    order: 2,
    logoLocalPath: "/images/afd/partenaires/chwid.png",
    sourceLogoUrl:
      "https://ndkcywqihtnuoydwicrq.supabase.co/storage/v1/object/public/gallery/partenaires/1783517192898-design-sans-titre-7.png",
    websiteUrl: null,
    description: null,
  },
  {
    id: "e7b13e31-0713-45ea-8d3b-f57004814c09",
    name: "CARITAS",
    acronyme: "CARITAS",
    slug: "caritas",
    category: "international",
    order: 3,
    logoLocalPath: "/images/afd/partenaires/caritas.png",
    sourceLogoUrl:
      "https://ndkcywqihtnuoydwicrq.supabase.co/storage/v1/object/public/gallery/partenaires/1783517284168-design-sans-titre-11.png",
    websiteUrl: null,
    description: null,
  },
  {
    id: "e8e880a3-9231-428c-8fe2-808b4fee5691",
    name: "ROJAF",
    acronyme: "ROJAF",
    slug: "rojaf",
    category: "ong",
    order: 4,
    logoLocalPath: "/images/afd/partenaires/rojaf.png",
    sourceLogoUrl:
      "https://ndkcywqihtnuoydwicrq.supabase.co/storage/v1/object/public/gallery/partenaires/1783517413261-design-sans-titre-4.png",
    websiteUrl: null,
    description: null,
  },
  {
    id: "287ee040-9586-49d8-bbf8-9ca2dbc16eb6",
    name: "CASAMED",
    acronyme: "CASAMED",
    slug: "casamed",
    category: "ong",
    order: 5,
    logoLocalPath: "/images/afd/partenaires/casamed.png",
    sourceLogoUrl:
      "https://ndkcywqihtnuoydwicrq.supabase.co/storage/v1/object/public/gallery/partenaires/1783517479877-design-sans-titre-2.png",
    websiteUrl: null,
    description: null,
  },
  {
    id: "1fa6f63c-7472-4406-9a18-51f44e73c99a",
    name: "IMPACT SANTE AFRIQUE",
    acronyme: null,
    slug: "impact-sante-afrique",
    category: "international",
    order: 6,
    logoLocalPath: "/images/afd/partenaires/impact-sante-afrique.png",
    sourceLogoUrl:
      "https://ndkcywqihtnuoydwicrq.supabase.co/storage/v1/object/public/gallery/partenaires/1783517552627-design-sans-titre-1.png",
    websiteUrl: null,
    description: null,
  },
  {
    id: "e513d056-8cca-4a37-8e3c-140ae32c81fa",
    name: "CS4ME",
    acronyme: "CS4ME",
    slug: "cs4me",
    category: "ong",
    order: 7,
    logoLocalPath: "/images/afd/partenaires/cs4me.png",
    sourceLogoUrl:
      "https://ndkcywqihtnuoydwicrq.supabase.co/storage/v1/object/public/gallery/partenaires/1783517596267-design-sans-titre.png",
    websiteUrl: null,
    description: null,
  },
  {
    id: "6fa930fb-f968-4933-a872-be3ee585559c",
    name: "UAF",
    acronyme: "UAF",
    slug: "uaf",
    category: "international",
    order: 8,
    logoLocalPath: "/images/afd/partenaires/uaf.png",
    sourceLogoUrl:
      "https://ndkcywqihtnuoydwicrq.supabase.co/storage/v1/object/public/gallery/partenaires/1783517659221-design-sans-titre-6.png",
    websiteUrl: null,
    description: null,
  },
  {
    id: "83201d07-3ad8-4698-abc3-36253a5c3c01",
    name: "RACOJ",
    acronyme: "RACOJ",
    slug: "racoj",
    category: "ong",
    order: 9,
    logoLocalPath: "/images/afd/partenaires/racoj.png",
    sourceLogoUrl:
      "https://ndkcywqihtnuoydwicrq.supabase.co/storage/v1/object/public/gallery/partenaires/1783517723346-design-sans-titre-3.png",
    websiteUrl: null,
    description: null,
  },
  {
    id: "5735e51b-f31c-46b2-b479-0296166d961b",
    name: "PSDS",
    acronyme: "PSDS",
    slug: "psds",
    category: "ong",
    order: 10,
    logoLocalPath: "/images/afd/partenaires/psds.png",
    sourceLogoUrl:
      "https://ndkcywqihtnuoydwicrq.supabase.co/storage/v1/object/public/gallery/partenaires/1783517786473-design-sans-titre-10.png",
    websiteUrl: null,
    description: null,
  },
  {
    id: "375bf99d-5cd9-49f0-b1fd-036d47061c99",
    name: "ALLEVIATE",
    acronyme: "ALLEVIATE",
    slug: "alleviate",
    category: "international",
    order: 11,
    logoLocalPath: "/images/afd/partenaires/alleviate.png",
    sourceLogoUrl:
      "https://ndkcywqihtnuoydwicrq.supabase.co/storage/v1/object/public/gallery/partenaires/1783517857788-design-sans-titre-9.png",
    websiteUrl: null,
    description: null,
  },
  {
    id: "6e2ee100-6149-4656-9d68-19db8d9b9cf0",
    name: "PNSR",
    acronyme: "PNSR",
    slug: "pnsr",
    category: "ong",
    order: 12,
    logoLocalPath: "/images/afd/partenaires/pnsr.png",
    sourceLogoUrl:
      "https://ndkcywqihtnuoydwicrq.supabase.co/storage/v1/object/public/gallery/partenaires/1783517897852-design-sans-titre-12.png",
    websiteUrl: null,
    description: null,
  },
  {
    id: "11ef7127-9483-4055-a261-e2dab8c40b40",
    name: "SI JEUNESSE SAVAIT",
    acronyme: null,
    slug: "si-jeunesse-savait",
    category: "ong",
    order: 13,
    logoLocalPath: "/images/afd/partenaires/si-jeunesse-savait.png",
    sourceLogoUrl:
      "https://ndkcywqihtnuoydwicrq.supabase.co/storage/v1/object/public/gallery/partenaires/1783517951731-design-sans-titre-5.png",
    websiteUrl: null,
    description: null,
  },
] as const;

/** Noms issus d’anciens seeds SQL non présents sur afd-rdc.org. */
export const LEGACY_SEED_PARTNER_NAMES_TO_DEACTIVATE = [
  "UNICEF",
  "ONU Femmes",
  "OMS",
  "Union Européenne",
  "USAID",
  "OCHA",
  "CARE",
] as const;
