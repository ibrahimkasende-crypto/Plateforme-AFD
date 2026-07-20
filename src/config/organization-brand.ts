import { assets } from "@/config/assets";

/**
 * Organisation cliente initiale (AFD ASBL).
 * Les données institutionnelles migreront progressivement vers Supabase.
 */
export const AFD_ORGANIZATION_ID =
  "a0000000-0000-4000-8000-000000000afd" as const;

export const organizationBrand = {
  id: AFD_ORGANIZATION_ID,
  organizationName: "Alliance des Femmes pour le Développement",
  organizationShortName: "AFD",
  organizationLegalName:
    "Alliance des Femmes pour le Développement — AFD ASBL",
  organizationDomain: "afd-rdc.org",
  slug: "afd",
  logo: {
    src: assets.brand.logo,
    alt: "Logo officiel AFD — Alliance des Femmes pour le Développement",
    width: 64,
    height: 64,
  },
  primaryColor: "#034ea2",
  secondaryColor: "#e31c79",
} as const;

export type OrganizationBrand = typeof organizationBrand;
