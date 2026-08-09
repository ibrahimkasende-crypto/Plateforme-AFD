import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { withClient } from "@/lib/queries/public/client";

const STATIC_ROUTES = [
  "/",
  "/qui-sommes-nous",
  "/qui-sommes-nous/histoire",
  "/qui-sommes-nous/mission-vision-valeurs",
  "/qui-sommes-nous/gouvernance",
  "/qui-sommes-nous/equipe",
  "/qui-sommes-nous/organigramme",
  "/qui-sommes-nous/politiques-engagements",
  "/actions",
  "/actions/domaines-intervention",
  "/actions/programmes",
  "/actions/projets",
  "/actions/urgences",
  "/actions/zones-intervention",
  "/actions/clusters",
  "/impact",
  "/impact/resultats",
  "/impact/histoires",
  "/impact/temoignages",
  "/impact/rapports",
  "/actualites",
  "/bibliotheque",
  "/bibliotheque/archives",
  "/bibliotheque/phototheque",
  "/bibliotheque/videotheque",
  "/bibliotheque/rapports",
  "/bibliotheque/documents",
  "/ressources",
  "/ressources/mediatheque",
  "/ressources/documents",
  "/ressources/appels-offres",
  "/ressources/opportunites",
  "/ressources/newsletter",
  "/contact",
  "/adhesion",
  "/partenariat",
  "/soutenir",
  "/recherche",
  "/mentions-legales",
  "/politique-confidentialite",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  const dynamicSlugs = await withClient(
    { programmes: [] as { slug: string; updated_at: string | null }[], projets: [] as { slug: string; updated_at: string | null }[], actualites: [] as { slug: string; published_at: string | null }[] },
    async (supabase) => {
      const [programmesRes, projetsRes, actualitesRes] = await Promise.all([
        supabase.from("programmes").select("slug, updated_at").eq("active", true),
        supabase.from("projets").select("slug, updated_at").eq("active", true),
        supabase
          .from("actualites")
          .select("slug, published_at")
          .eq("published", true),
      ]);

      return {
        programmes: programmesRes.data ?? [],
        projets: projetsRes.data ?? [],
        actualites: actualitesRes.data ?? [],
      };
    },
  );

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const programmeEntries: MetadataRoute.Sitemap = dynamicSlugs.programmes.map(
    (item) => ({
      url: `${baseUrl}/actions/programmes/${item.slug}`,
      lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  const projetEntries: MetadataRoute.Sitemap = dynamicSlugs.projets.map((item) => ({
    url: `${baseUrl}/actions/projets/${item.slug}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const actualiteEntries: MetadataRoute.Sitemap = dynamicSlugs.actualites.map(
    (item) => ({
      url: `${baseUrl}/actualites/${item.slug}`,
      lastModified: item.published_at ? new Date(item.published_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  return [
    ...staticEntries,
    ...programmeEntries,
    ...projetEntries,
    ...actualiteEntries,
  ];
}
