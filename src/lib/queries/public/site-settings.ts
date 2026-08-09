import "server-only";

import { siteConfig } from "@/config/site";
import { homeContent } from "@/config/home-content";
import { getPublicSiteParameters } from "@/lib/queries/public/organisation";

export type ResolvedPublicSiteSettings = {
  orgName: string;
  shortName: string;
  slogan: string;
  foundedLabel: string;
  mission: string;
  vision: string;
  values: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
    whatsapp: string;
    twitter: string;
  };
  logoUrl: string;
  faviconUrl: string;
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  source: "database" | "fallback";
};

function mapParams(rows: Array<{ key: string; value: string }>): Map<string, string> {
  const map = new Map<string, string>();
  for (const row of rows) {
    if (row.key && row.value != null) map.set(row.key, row.value);
  }
  return map;
}

function pick(
  map: Map<string, string>,
  key: string,
  fallback: string,
): string {
  const value = map.get(key)?.trim();
  return value || fallback;
}

/**
 * Paramètres publics résolus depuis `parametres_site` avec repli `siteConfig`.
 * Source unique pour footer, contact, identité.
 */
export async function getResolvedPublicSiteSettings(): Promise<ResolvedPublicSiteSettings> {
  const rows = await getPublicSiteParameters();
  const map = mapParams(rows);
  const hasDb = map.size > 0;

  return {
    orgName: pick(map, "org.name", siteConfig.name),
    shortName: pick(map, "org.short_name", siteConfig.shortName),
    slogan: pick(map, "org.slogan", siteConfig.description.slice(0, 120)),
    foundedLabel: pick(
      map,
      "org.founded_year",
      homeContent.organization.foundedLabel,
    ),
    mission: pick(map, "org.mission", ""),
    vision: pick(map, "org.vision", ""),
    values: pick(map, "org.values", ""),
    contact: {
      email: pick(map, "contact.email", siteConfig.contact.email),
      phone: pick(map, "contact.phone", siteConfig.contact.phone),
      address: pick(map, "contact.address", siteConfig.contact.address),
    },
    social: {
      facebook: pick(map, "social.facebook", siteConfig.social.facebook),
      linkedin: pick(map, "social.linkedin", siteConfig.social.linkedin),
      youtube: pick(map, "social.youtube", siteConfig.social.youtube),
      tiktok: pick(map, "social.tiktok", siteConfig.social.tiktok),
      whatsapp: pick(map, "social.whatsapp", siteConfig.social.whatsapp),
      twitter: pick(map, "social.twitter", ""),
    },
    logoUrl: pick(map, "brand.logo_url", siteConfig.logo.src),
    faviconUrl: pick(map, "brand.favicon_url", "/favicon.ico"),
    homeHeroTitle: pick(map, "home.hero_title", homeContent.hero.title),
    homeHeroSubtitle: pick(
      map,
      "home.hero_subtitle",
      homeContent.hero.description,
    ),
    source: hasDb ? "database" : "fallback",
  };
}
