import {
  FALLBACK_INTERVENTION_DOMAINS,
  type InterventionDomain,
} from "@/config/intervention-domains";
import { withClient } from "@/lib/queries/public/client";

type DomainRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  description: string | null;
  challenge: string | null;
  response: string | null;
  priority_actions: string[] | null;
  audiences: string[] | null;
  expected_results: string[] | null;
  keywords: string[] | null;
  icon: string | null;
  image_url: string | null;
  image_alt: string | null;
  order_index: number | null;
  status: string | null;
  featured: boolean | null;
  seo_title: string | null;
  seo_description: string | null;
  topics: string[] | null;
};

function mapRow(row: DomainRow): InterventionDomain {
  const fallback =
    FALLBACK_INTERVENTION_DOMAINS.find((d) => d.slug === row.slug) ??
    FALLBACK_INTERVENTION_DOMAINS[0];
  const officialFallbackImage =
    fallback.slug === row.slug ? fallback.imageSrc : null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? fallback.subtitle,
    summary: row.summary ?? fallback.summary,
    description: row.description ?? fallback.description,
    challenge: row.challenge ?? fallback.challenge,
    response: row.response ?? fallback.response,
    priorityActions: row.priority_actions?.length
      ? row.priority_actions
      : fallback.priorityActions,
    audiences: row.audiences?.length ? row.audiences : fallback.audiences,
    expectedResults: row.expected_results?.length
      ? row.expected_results
      : fallback.expectedResults,
    keywords: row.keywords?.length ? row.keywords : fallback.keywords,
    icon: row.icon ?? fallback.icon,
    imageSrc: row.image_url ?? officialFallbackImage ?? fallback.imageSrc,
    imageAlt: row.image_alt ?? fallback.imageAlt,
    orderIndex: row.order_index ?? fallback.orderIndex,
    status:
      row.status === "brouillon" || row.status === "archive"
        ? row.status
        : "publie",
    featured: row.featured ?? false,
    seoTitle: row.seo_title ?? fallback.seoTitle,
    seoDescription: row.seo_description ?? fallback.seoDescription,
    topics: row.topics?.length ? row.topics : fallback.topics,
  };
}

export async function getPublishedInterventionDomains(): Promise<
  InterventionDomain[]
> {
  return withClient([...FALLBACK_INTERVENTION_DOMAINS], async (supabase) => {
    const { data, error } = await supabase
      .from("domaines_intervention" as never)
      .select(
        "id, slug, title, subtitle, summary, description, challenge, response, priority_actions, audiences, expected_results, keywords, icon, image_url, image_alt, order_index, status, featured, seo_title, seo_description, topics" as never,
      )
      .eq("status" as never, "publie")
      .order("order_index" as never, { ascending: true });

    if (error || !data || !Array.isArray(data) || data.length === 0) {
      return [...FALLBACK_INTERVENTION_DOMAINS];
    }

    return (data as DomainRow[]).map(mapRow);
  });
}

export async function getFeaturedInterventionDomains(): Promise<
  InterventionDomain[]
> {
  const domains = await getPublishedInterventionDomains();
  const featured = domains.filter((domain) => domain.featured);
  return featured.length > 0 ? featured : domains.slice(0, 3);
}

export async function getInterventionDomainBySlug(
  slug: string,
): Promise<InterventionDomain | null> {
  const fromDb = await withClient(null as InterventionDomain | null, async (supabase) => {
    const { data, error } = await supabase
      .from("domaines_intervention" as never)
      .select(
        "id, slug, title, subtitle, summary, description, challenge, response, priority_actions, audiences, expected_results, keywords, icon, image_url, image_alt, order_index, status, featured, seo_title, seo_description, topics" as never,
      )
      .eq("slug" as never, slug)
      .eq("status" as never, "publie")
      .maybeSingle();

    if (error || !data) return null;
    return mapRow(data as DomainRow);
  });

  if (fromDb) return fromDb;
  return FALLBACK_INTERVENTION_DOMAINS.find((domain) => domain.slug === slug) ?? null;
}
