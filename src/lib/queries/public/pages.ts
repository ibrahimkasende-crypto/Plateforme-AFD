import { withClient } from "./client";

export type CmsPageSection = {
  id: string;
  type_section: string;
  titre: string | null;
  sous_titre: string | null;
  contenu: string | null;
  media_id: string | null;
  ordre: number;
  configuration: Record<string, unknown>;
};

export type CmsPage = {
  id: string;
  route: string;
  titre: string;
  slug: string | null;
  surtitre: string | null;
  resume: string | null;
  description_seo: string | null;
  sections: CmsPageSection[];
};

export async function getPublishedPageByRoute(
  route: string,
): Promise<CmsPage | null> {
  const safeRoute = route.trim();
  if (!safeRoute) return null;

  return withClient(null, async (supabase) => {
    const { data: page, error } = await supabase
      .from("pages")
      .select(
        "id, route, titre, slug, surtitre, resume, description_seo",
      )
      .eq("route", safeRoute)
      .eq("publie", true)
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !page) return null;

    const { data: sections } = await supabase
      .from("sections_pages")
      .select(
        "id, type_section, titre, sous_titre, contenu, media_id, ordre, configuration",
      )
      .eq("page_id", page.id)
      .eq("active", true)
      .order("ordre", { ascending: true });

    return {
      ...(page as Omit<CmsPage, "sections">),
      sections: (sections ?? []).map((section) => ({
        ...section,
        configuration:
          section.configuration &&
          typeof section.configuration === "object" &&
          !Array.isArray(section.configuration)
            ? (section.configuration as Record<string, unknown>)
            : {},
      })),
    };
  });
}
