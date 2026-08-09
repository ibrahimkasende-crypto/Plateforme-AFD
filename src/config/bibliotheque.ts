import catalog from "@/config/bibliotheque-catalog.json";
import { normalizeLibraryAssetUrl } from "@/config/afd-images";
import { FALLBACK_EVENT_ARCHIVES, type EventArchive } from "@/config/event-archives";

export type LibraryActivityStatus = "en_cours" | "terminee" | "archivee";

export type LibraryImage = {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string | null;
  isCover: boolean;
  orderIndex: number;
};

export type LibraryActivity = {
  id: string;
  slug: string;
  categorySlug: string;
  categoryLabel: string;
  domainSlug: string;
  folder: string;
  title: string;
  summary: string;
  description: string;
  status: LibraryActivityStatus;
  published: boolean;
  featured: boolean;
  eventDate: string | null;
  province: string | null;
  territory: string | null;
  locality: string | null;
  locationName: string | null;
  project: string | null;
  partners: string[];
  tags: string[];
  author: string;
  coverImageUrl: string | null;
  photoCount: number;
  downloadCount: number;
  publishedAt: string | null;
  updatedAt: string | null;
  images: LibraryImage[];
};

export type LibraryCategory = {
  slug: string;
  label: string;
  domainSlug: string;
  coverImageUrl: string | null;
  activityCount: number;
  photoCount: number;
  latestTitle: string | null;
  latestSlug: string | null;
};

function categoryFromEvent(event: EventArchive) {
  if (event.categorySlug && event.categoryLabel) {
    return { slug: event.categorySlug, label: event.categoryLabel };
  }
  if (event.domainSlug === "sante-maternelle-infantile") {
    return { slug: "sante", label: "Santé" };
  }
  if (event.domainSlug === "eau-hygiene-assainissement") {
    return { slug: "wash", label: "WASH" };
  }
  if (event.domainSlug === "protection-vbg-droits-femmes") {
    return { slug: "protection", label: "Protection" };
  }
  if (event.domainSlug === "autonomisation-economique") {
    return { slug: "autonomisation", label: "Autonomisation" };
  }
  if (event.domainSlug === "femmes-leadership-gouvernance-communautaire") {
    return { slug: "gouvernance", label: "Gouvernance" };
  }
  if (event.domainSlug === "femmes-reponse-humanitaire-urgence") {
    return { slug: "missions-terrain", label: "Missions de terrain" };
  }
  return { slug: event.domainSlug, label: event.domainSlug };
}

function libraryActivityFromEvent(event: EventArchive): LibraryActivity {
  const category = categoryFromEvent(event);
  return {
    id: `event-${event.id}`,
    slug: event.slug,
    categorySlug: category.slug,
    categoryLabel: category.label,
    domainSlug: event.domainSlug,
    folder: "archives-terrain",
    title: event.title,
    summary: event.summary,
    description: event.description,
    status: "terminee",
    published: event.published,
    featured: event.featured,
    eventDate: event.eventDate,
    province: event.province,
    territory: event.territory,
    locality: event.locality,
    locationName: event.locationName,
    project: event.project ?? null,
    partners: event.partners ?? [],
    tags: event.tags,
    author: "AFD ASBL",
    coverImageUrl: event.coverImageUrl,
    photoCount: event.images.length,
    downloadCount: 0,
    publishedAt: event.eventDate
      ? `${event.eventDate}T08:00:00.000Z`
      : null,
    updatedAt: null,
    images: event.images.map((image) => ({
      id: image.id,
      src: image.src,
      alt: image.alt,
      title: image.title,
      caption: image.caption,
      isCover: image.isCover,
      orderIndex: image.orderIndex,
    })),
  };
}

function mergeActivities(
  primary: LibraryActivity[],
  secondary: LibraryActivity[],
): LibraryActivity[] {
  const seen = new Set<string>();
  const merged: LibraryActivity[] = [];
  for (const activity of [...primary, ...secondary]) {
    if (seen.has(activity.slug)) continue;
    seen.add(activity.slug);
    merged.push(activity);
  }
  return merged;
}

const catalogActivities = (catalog.activities as LibraryActivity[]).map((activity) => ({
  ...activity,
  coverImageUrl: activity.coverImageUrl
    ? normalizeLibraryAssetUrl(activity.coverImageUrl)
    : null,
  images: activity.images.map((image) => ({
    ...image,
    src: normalizeLibraryAssetUrl(image.src),
  })),
}));

const manualActivities = FALLBACK_EVENT_ARCHIVES.map(libraryActivityFromEvent);
const activities = mergeActivities(manualActivities, catalogActivities).sort(
  (a, b) => {
    const da = Date.parse(a.eventDate ?? a.publishedAt ?? "");
    const db = Date.parse(b.eventDate ?? b.publishedAt ?? "");
    return (Number.isNaN(db) ? 0 : db) - (Number.isNaN(da) ? 0 : da);
  },
);
const categories = (catalog.categories as LibraryCategory[]).map((category) => ({
  ...category,
  coverImageUrl: category.coverImageUrl
    ? normalizeLibraryAssetUrl(category.coverImageUrl)
    : null,
}));

export function getLibraryCategories(options?: {
  withContentOnly?: boolean;
}): LibraryCategory[] {
  const list = options?.withContentOnly
    ? categories.filter((c) => c.activityCount > 0)
    : categories;
  return [...list].sort((a, b) => a.label.localeCompare(b.label, "fr"));
}

export function getLibraryCategoryBySlug(
  slug: string,
): LibraryCategory | null {
  return categories.find((c) => c.slug === slug) ?? null;
}

export function getAllLibraryActivities(): LibraryActivity[] {
  return activities.filter((a) => a.published);
}

export function getLibraryActivityBySlug(
  slug: string,
): LibraryActivity | null {
  return activities.find((a) => a.slug === slug && a.published) ?? null;
}

export function getLibraryActivitiesByCategory(
  categorySlug: string,
): LibraryActivity[] {
  return activities.filter(
    (a) => a.published && a.categorySlug === categorySlug,
  );
}

export function searchLibraryActivities(filters: {
  q?: string;
  category?: string;
  province?: string;
  year?: string;
  status?: string;
  partner?: string;
}): LibraryActivity[] {
  const q = filters.q?.trim().toLowerCase() ?? "";
  return getAllLibraryActivities().filter((item) => {
    if (filters.category && item.categorySlug !== filters.category) return false;
    if (filters.province && (item.province ?? "").toLowerCase() !== filters.province.toLowerCase()) {
      return false;
    }
    if (filters.status && item.status !== filters.status) return false;
    if (filters.year) {
      const y = item.eventDate?.slice(0, 4) ?? item.publishedAt?.slice(0, 4);
      if (y !== filters.year) return false;
    }
    if (filters.partner) {
      const needle = filters.partner.toLowerCase();
      if (!item.partners.some((p) => p.toLowerCase().includes(needle))) {
        return false;
      }
    }
    if (!q) return true;
    const hay = [
      item.title,
      item.summary,
      item.description,
      item.categoryLabel,
      item.province ?? "",
      item.territory ?? "",
      item.locality ?? "",
      item.project ?? "",
      ...item.tags,
      ...item.partners,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function getSimilarLibraryActivities(
  activity: LibraryActivity,
  limit = 4,
): LibraryActivity[] {
  return getAllLibraryActivities()
    .filter(
      (item) =>
        item.slug !== activity.slug &&
        (item.categorySlug === activity.categorySlug ||
          item.domainSlug === activity.domainSlug ||
          (item.province && item.province === activity.province) ||
          (item.project && item.project === activity.project)),
    )
    .slice(0, limit);
}

export function getRecentLibraryActivities(
  excludeSlug?: string,
  limit = 4,
): LibraryActivity[] {
  return getAllLibraryActivities()
    .filter((item) => item.slug !== excludeSlug)
    .slice(0, limit);
}

export function getLibraryStats() {
  const all = getAllLibraryActivities();
  return {
    activityCount: all.length,
    photoCount: all.reduce((n, a) => n + a.photoCount, 0),
    categoryCount: getLibraryCategories({ withContentOnly: true }).length,
  };
}
