import {
  getAllLibraryActivities,
  getLibraryActivityBySlug as getCatalogActivityBySlug,
  getLibraryCategories as getCatalogCategories,
  type LibraryActivity,
  type LibraryActivityStatus,
  type LibraryCategory,
  type LibraryImage,
} from "@/config/bibliotheque";
import { normalizeLibraryAssetUrl } from "@/config/afd-images";
import { withClient } from "@/lib/queries/public/client";
import { getPublishedDocuments } from "@/lib/queries/public/documents";

export type {
  LibraryActivity,
  LibraryActivityStatus,
  LibraryCategory,
  LibraryImage,
};

type EventRow = {
  id: string;
  slug: string;
  titre: string;
  resume: string | null;
  description: string | null;
  domaine_slug: string;
  categorie_slug: string | null;
  categorie_label: string | null;
  date_evenement: string | null;
  lieu_nom: string | null;
  adresse: string | null;
  province: string | null;
  territoire: string | null;
  localite: string | null;
  projet: string | null;
  partenaires: string[] | null;
  tags: string[] | null;
  auteur: string | null;
  cover_image_url: string | null;
  statut: string;
  publie: boolean;
  featured: boolean;
  download_count: number | null;
  published_at: string | null;
  updated_at: string | null;
  bibliotheque_images?: Array<{
    id: string;
    title: string | null;
    caption: string | null;
    alt_text: string | null;
    local_asset_path: string | null;
    public_url: string | null;
    is_cover: boolean | null;
    order_index: number | null;
  }> | null;
};

function mapStatus(statut: string): LibraryActivityStatus {
  if (statut === "en_cours") return "en_cours";
  if (statut === "archive" || statut === "archivee") return "archivee";
  return "terminee";
}

function mapRow(row: EventRow): LibraryActivity {
  const images: LibraryImage[] = (row.bibliotheque_images ?? [])
    .map((image, index) => {
      const src = normalizeLibraryAssetUrl(
        image.public_url || image.local_asset_path || "",
      );
      if (!src) return null;
      return {
        id: image.id,
        src,
        alt: image.alt_text ?? image.title ?? row.titre,
        title: image.title ?? row.titre,
        caption: image.caption,
        isCover: image.is_cover ?? index === 0,
        orderIndex: image.order_index ?? index + 1,
      };
    })
    .filter((item): item is LibraryImage => Boolean(item))
    .sort((a, b) => a.orderIndex - b.orderIndex);

  return {
    id: row.id,
    slug: row.slug,
    categorySlug: row.categorie_slug ?? row.domaine_slug,
    categoryLabel: row.categorie_label ?? row.domaine_slug,
    domainSlug: row.domaine_slug,
    folder: "",
    title: row.titre,
    summary: row.resume ?? "",
    description: row.description ?? row.resume ?? "",
    status: mapStatus(row.statut),
    published: row.publie,
    featured: row.featured,
    eventDate: row.date_evenement,
    province: row.province,
    territory: row.territoire,
    locality: row.localite,
    locationName: row.lieu_nom,
    project: row.projet,
    partners: row.partenaires ?? [],
    tags: row.tags ?? [],
    author: row.auteur ?? "AFD ASBL",
    coverImageUrl: normalizeLibraryAssetUrl(
      row.cover_image_url || images[0]?.src || "",
    ) || null,
    photoCount: images.length,
    downloadCount: row.download_count ?? 0,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    images,
  };
}

async function fetchPublishedFromDb(): Promise<LibraryActivity[] | null> {
  return withClient(null, async (supabase) => {
    const { data, error } = await supabase
      .from("bibliotheque_evenements" as never)
      .select(
        "id, slug, titre, resume, description, domaine_slug, categorie_slug, categorie_label, date_evenement, lieu_nom, adresse, province, territoire, localite, projet, partenaires, tags, auteur, cover_image_url, statut, publie, featured, download_count, published_at, updated_at, bibliotheque_images(id, title, caption, alt_text, local_asset_path, public_url, is_cover, order_index)" as never,
      )
      .eq("publie" as never, true)
      .is("deleted_at" as never, null)
      .order("updated_at" as never, { ascending: false });

    if (error || !data || !Array.isArray(data) || data.length === 0) {
      return null;
    }
    return (data as unknown as EventRow[]).map(mapRow);
  });
}

function compareActivityDateDesc(a: LibraryActivity, b: LibraryActivity) {
  const da = Date.parse(a.eventDate ?? a.publishedAt ?? "");
  const db = Date.parse(b.eventDate ?? b.publishedAt ?? "");
  return (Number.isNaN(db) ? 0 : db) - (Number.isNaN(da) ? 0 : da);
}

function mergeActivities(
  primary: LibraryActivity[],
  secondary: LibraryActivity[],
): LibraryActivity[] {
  const seen = new Set(primary.map((activity) => activity.slug));
  return [
    ...primary,
    ...secondary.filter((activity) => !seen.has(activity.slug)),
  ].sort(compareActivityDateDesc);
}

export async function listLibraryActivities(): Promise<LibraryActivity[]> {
  const fromDb = await fetchPublishedFromDb();
  const fallback = getAllLibraryActivities();
  return fromDb ? mergeActivities(fromDb, fallback) : fallback;
}

export async function getLibraryActivityBySlug(
  slug: string,
): Promise<LibraryActivity | null> {
  const fromDb = await withClient(null, async (supabase) => {
    const { data, error } = await supabase
      .from("bibliotheque_evenements" as never)
      .select(
        "id, slug, titre, resume, description, domaine_slug, categorie_slug, categorie_label, date_evenement, lieu_nom, adresse, province, territoire, localite, projet, partenaires, tags, auteur, cover_image_url, statut, publie, featured, download_count, published_at, updated_at, bibliotheque_images(id, title, caption, alt_text, local_asset_path, public_url, is_cover, order_index)" as never,
      )
      .eq("slug" as never, slug)
      .eq("publie" as never, true)
      .is("deleted_at" as never, null)
      .maybeSingle();
    if (error || !data) return null;
    return mapRow(data as unknown as EventRow);
  });
  return fromDb ?? getCatalogActivityBySlug(slug);
}

export async function searchLibraryActivities(filters: {
  q?: string;
  category?: string;
  province?: string;
  year?: string;
  status?: string;
  partner?: string;
}): Promise<LibraryActivity[]> {
  const all = await listLibraryActivities();
  const q = filters.q?.trim().toLowerCase() ?? "";
  return all.filter((item) => {
    if (filters.category && item.categorySlug !== filters.category) return false;
    if (
      filters.province &&
      (item.province ?? "").toLowerCase() !== filters.province.toLowerCase()
    ) {
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

export async function getLibraryCategories(options?: {
  withContentOnly?: boolean;
}): Promise<LibraryCategory[]> {
  const activities = await listLibraryActivities();
  if (activities.length === 0) {
    return getCatalogCategories(options);
  }
  const map = new Map<string, LibraryCategory>();
  for (const activity of activities) {
    const current = map.get(activity.categorySlug) ?? {
      slug: activity.categorySlug,
      label: activity.categoryLabel,
      domainSlug: activity.domainSlug,
      coverImageUrl: activity.coverImageUrl,
      activityCount: 0,
      photoCount: 0,
      latestTitle: activity.title,
      latestSlug: activity.slug,
    };
    current.activityCount += 1;
    current.photoCount += activity.photoCount;
    if (!current.coverImageUrl && activity.coverImageUrl) {
      current.coverImageUrl = activity.coverImageUrl;
    }
    map.set(activity.categorySlug, current);
  }
  let list = [...map.values()].sort((a, b) =>
    a.label.localeCompare(b.label, "fr"),
  );
  if (options?.withContentOnly) {
    list = list.filter((c) => c.activityCount > 0);
  }
  return list;
}

export async function getLibraryStats() {
  const [activities, docs] = await Promise.all([
    listLibraryActivities(),
    getPublishedDocuments(),
  ]);
  const source =
    activities.length > 0 ? activities : getAllLibraryActivities();
  const categories =
    activities.length > 0
      ? await getLibraryCategories({ withContentOnly: true })
      : getCatalogCategories({ withContentOnly: true });
  const provinces = new Set(
    source.map((a) => a.province).filter(Boolean) as string[],
  );
  const projects = new Set(
    source.map((a) => a.project).filter(Boolean) as string[],
  );
  const years = new Set(
    source
      .map((a) => a.eventDate?.slice(0, 4) ?? a.publishedAt?.slice(0, 4))
      .filter(Boolean) as string[],
  );
  const reports = docs.filter(
    (d) =>
      (d.type ?? "").toLowerCase().includes("rapport") ||
      (d.slug ?? "").toLowerCase().includes("rapport"),
  );
  return {
    activityCount: source.length,
    photoCount: source.reduce((n, a) => n + a.photoCount, 0),
    categoryCount: categories.length,
    reportCount: reports.length,
    provinceCount: provinces.size,
    projectCount: projects.size,
    archiveYearCount: years.size,
    videoCount: 0,
    documentCount: docs.length,
  };
}

export type LibraryPhotoEntry = LibraryImage & {
  activitySlug: string;
  activityTitle: string;
  categorySlug: string;
  categoryLabel: string;
  province: string | null;
  project: string | null;
  year: string | null;
  partners: string[];
};

export async function listLibraryPhotos(filters?: {
  q?: string;
  category?: string;
  activity?: string;
  project?: string;
  province?: string;
  year?: string;
  partner?: string;
  sort?: "recent" | "oldest";
}): Promise<LibraryPhotoEntry[]> {
  const activities = await searchLibraryActivities({
    q: filters?.q,
    category: filters?.category,
    province: filters?.province,
    year: filters?.year,
    partner: filters?.partner,
  });
  let photos: LibraryPhotoEntry[] = [];
  for (const activity of activities) {
    if (filters?.activity && activity.slug !== filters.activity) continue;
    if (filters?.project && (activity.project ?? "") !== filters.project) {
      continue;
    }
    const year =
      activity.eventDate?.slice(0, 4) ?? activity.publishedAt?.slice(0, 4) ?? null;
    for (const image of activity.images) {
      photos.push({
        ...image,
        activitySlug: activity.slug,
        activityTitle: activity.title,
        categorySlug: activity.categorySlug,
        categoryLabel: activity.categoryLabel,
        province: activity.province,
        project: activity.project,
        year,
        partners: activity.partners,
      });
    }
  }
  if (filters?.sort === "oldest") {
    photos = photos.reverse();
  }
  return photos;
}

export async function getArchiveTimeline(): Promise<
  Array<{ year: string; activityCount: number }>
> {
  const activities = await listLibraryActivities();
  const map = new Map<string, number>();
  for (const activity of activities) {
    const year =
      activity.eventDate?.slice(0, 4) ?? activity.publishedAt?.slice(0, 4);
    if (!year) continue;
    map.set(year, (map.get(year) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([year, activityCount]) => ({ year, activityCount }))
    .sort((a, b) => b.year.localeCompare(a.year));
}

export async function getLibraryActivitiesByDomain(
  domainSlug: string,
): Promise<LibraryActivity[]> {
  const all = await listLibraryActivities();
  return all.filter(
    (a) => a.domainSlug === domainSlug || a.categorySlug === domainSlug,
  );
}

export async function getLibraryActivitiesByProject(
  projectSlugOrName: string,
): Promise<LibraryActivity[]> {
  const needle = projectSlugOrName.toLowerCase().replace(/-/g, " ");
  const all = await listLibraryActivities();
  return all.filter((a) => {
    if (!a.project) return false;
    const p = a.project.toLowerCase();
    return (
      p === needle ||
      p.includes(needle) ||
      a.project.toLowerCase().replace(/\s+/g, "-") === projectSlugOrName
    );
  });
}

export async function getLibraryActivitiesByProvince(
  provinceSlug: string,
): Promise<LibraryActivity[]> {
  const needle = provinceSlug.toLowerCase().replace(/-/g, " ");
  const all = await listLibraryActivities();
  return all.filter((a) => {
    if (!a.province) return false;
    const p = a.province.toLowerCase();
    return (
      p === needle ||
      p.includes(needle) ||
      a.province.toLowerCase().replace(/\s+/g, "-") === provinceSlug
    );
  });
}

export async function getAdjacentLibraryActivities(
  slug: string,
): Promise<{ previous: LibraryActivity | null; next: LibraryActivity | null }> {
  const all = await listLibraryActivities();
  const index = all.findIndex((a) => a.slug === slug);
  if (index < 0) return { previous: null, next: null };
  return {
    previous: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}

export async function listLibraryProvinces(): Promise<
  Array<{ slug: string; label: string; activityCount: number }>
> {
  const all = await listLibraryActivities();
  const map = new Map<string, { label: string; activityCount: number }>();
  for (const a of all) {
    if (!a.province) continue;
    const slug = a.province.toLowerCase().replace(/\s+/g, "-");
    const current = map.get(slug) ?? { label: a.province, activityCount: 0 };
    current.activityCount += 1;
    map.set(slug, current);
  }
  return [...map.entries()]
    .map(([slug, v]) => ({ slug, ...v }))
    .sort((a, b) => a.label.localeCompare(b.label, "fr"));
}

export async function listLibraryProjects(): Promise<
  Array<{ slug: string; label: string; activityCount: number }>
> {
  const all = await listLibraryActivities();
  const map = new Map<string, { label: string; activityCount: number }>();
  for (const a of all) {
    if (!a.project) continue;
    const slug = a.project.toLowerCase().replace(/\s+/g, "-");
    const current = map.get(slug) ?? { label: a.project, activityCount: 0 };
    current.activityCount += 1;
    map.set(slug, current);
  }
  return [...map.entries()]
    .map(([slug, v]) => ({ slug, ...v }))
    .sort((a, b) => a.label.localeCompare(b.label, "fr"));
}

export async function getSimilarLibraryActivities(
  activity: LibraryActivity,
  limit = 4,
): Promise<LibraryActivity[]> {
  const all = await listLibraryActivities();
  return all
    .filter(
      (item) =>
        item.slug !== activity.slug &&
        (item.categorySlug === activity.categorySlug ||
          item.domainSlug === activity.domainSlug ||
          (item.province && item.province === activity.province)),
    )
    .slice(0, limit);
}

export async function getRecentLibraryActivities(
  excludeSlug?: string,
  limit = 4,
): Promise<LibraryActivity[]> {
  const all = await listLibraryActivities();
  return all.filter((item) => item.slug !== excludeSlug).slice(0, limit);
}
