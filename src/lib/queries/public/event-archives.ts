import {
  getFallbackEventArchiveBySlug,
  getFallbackEventArchivesByDomain,
  type EventArchive,
  type EventArchiveImage,
} from "@/config/event-archives";
import { withClient } from "@/lib/queries/public/client";

type ArchiveImageRow = {
  id: string;
  title: string | null;
  caption: string | null;
  alt_text: string | null;
  storage_bucket: string | null;
  storage_path: string | null;
  public_url: string | null;
  local_asset_path: string | null;
  taken_at: string | null;
  consent_status: EventArchiveImage["consentStatus"] | null;
  is_cover: boolean | null;
  order_index: number | null;
};

type ArchiveEventRow = {
  id: string;
  slug: string;
  titre: string;
  resume: string | null;
  description: string | null;
  domaine_slug: string;
  date_evenement: string | null;
  heure_debut: string | null;
  heure_fin: string | null;
  lieu_nom: string | null;
  adresse: string | null;
  province: string | null;
  territoire: string | null;
  localite: string | null;
  latitude: number | null;
  longitude: number | null;
  tags: string[] | null;
  cover_image_url: string | null;
  publie: boolean | null;
  featured: boolean | null;
  actualites?: { slug: string; title: string } | null;
  bibliotheque_images?: ArchiveImageRow[] | null;
};

function normalizeAssetUrl(value: string | null): string | null {
  if (!value) return null;
  if (value.startsWith("/assets/")) return encodeURI(value);
  return value;
}

function imageSrc(row: ArchiveImageRow): string | null {
  if (row.public_url) return row.public_url;
  if (row.local_asset_path) return normalizeAssetUrl(row.local_asset_path);
  if (row.storage_bucket && row.storage_path) {
    return `${row.storage_bucket}/${row.storage_path}`;
  }
  return null;
}

function mapRow(row: ArchiveEventRow): EventArchive {
  const images = (row.bibliotheque_images ?? [])
    .map((imageRow): EventArchiveImage | null => {
      const src = imageSrc(imageRow);
      if (!src) return null;
      return {
        id: imageRow.id,
        src,
        alt: imageRow.alt_text ?? imageRow.title ?? row.titre,
        title: imageRow.title ?? row.titre,
        caption: imageRow.caption,
        isCover: imageRow.is_cover ?? false,
        orderIndex: imageRow.order_index ?? 0,
        takenAt: imageRow.taken_at,
        consentStatus: imageRow.consent_status ?? "to-review",
      };
    })
    .filter((imageItem): imageItem is EventArchiveImage => Boolean(imageItem))
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const cover = normalizeAssetUrl(row.cover_image_url) ?? images.find((item) => item.isCover)?.src;

  return {
    id: row.id,
    slug: row.slug,
    domainSlug: row.domaine_slug,
    title: row.titre,
    summary: row.resume ?? "",
    description: row.description ?? row.resume ?? "",
    eventDate: row.date_evenement,
    startTime: row.heure_debut,
    endTime: row.heure_fin,
    locationName: row.lieu_nom,
    address: row.adresse,
    province: row.province,
    territory: row.territoire,
    locality: row.localite,
    latitude: row.latitude,
    longitude: row.longitude,
    tags: row.tags ?? [],
    coverImageUrl: cover ?? null,
    published: row.publie ?? false,
    featured: row.featured ?? false,
    relatedArticleSlug: row.actualites?.slug ?? null,
    relatedArticleTitle: row.actualites?.title ?? null,
    images,
  };
}

function compareEventDateDesc(a: EventArchive, b: EventArchive) {
  const da = a.eventDate ? Date.parse(a.eventDate) : 0;
  const db = b.eventDate ? Date.parse(b.eventDate) : 0;
  return db - da;
}

function mergeArchives(
  primary: EventArchive[],
  secondary: EventArchive[],
): EventArchive[] {
  const seen = new Set(primary.map((event) => event.slug));
  return [
    ...primary,
    ...secondary.filter((event) => !seen.has(event.slug)),
  ].sort(compareEventDateDesc);
}

export async function getPublishedEventArchivesByDomain(
  domainSlug: string,
): Promise<EventArchive[]> {
  const fallback = getFallbackEventArchivesByDomain(domainSlug);

  return withClient(fallback, async (supabase) => {
    const { data, error } = await supabase
      .from("bibliotheque_evenements" as never)
      .select(
        "id, slug, titre, resume, description, domaine_slug, date_evenement, heure_debut, heure_fin, lieu_nom, adresse, province, territoire, localite, latitude, longitude, tags, cover_image_url, publie, featured, actualites(slug, title), bibliotheque_images(id, title, caption, alt_text, storage_bucket, storage_path, public_url, local_asset_path, taken_at, consent_status, is_cover, order_index)" as never,
      )
      .eq("domaine_slug" as never, domainSlug)
      .eq("publie" as never, true)
      .eq("statut" as never, "publie")
      .is("deleted_at" as never, null)
      .order("date_evenement" as never, { ascending: false })
      .order("order_index" as never, { ascending: true });

    if (error || !data || !Array.isArray(data) || data.length === 0) {
      return fallback;
    }

    return mergeArchives((data as unknown as ArchiveEventRow[]).map(mapRow), fallback);
  });
}

export async function getPublishedEventArchiveBySlug(
  domainSlug: string,
  eventSlug: string,
): Promise<EventArchive | null> {
  const fallback = getFallbackEventArchiveBySlug(domainSlug, eventSlug);

  return withClient(fallback, async (supabase) => {
    const { data, error } = await supabase
      .from("bibliotheque_evenements" as never)
      .select(
        "id, slug, titre, resume, description, domaine_slug, date_evenement, heure_debut, heure_fin, lieu_nom, adresse, province, territoire, localite, latitude, longitude, tags, cover_image_url, publie, featured, actualites(slug, title), bibliotheque_images(id, title, caption, alt_text, storage_bucket, storage_path, public_url, local_asset_path, taken_at, consent_status, is_cover, order_index)" as never,
      )
      .eq("domaine_slug" as never, domainSlug)
      .eq("slug" as never, eventSlug)
      .eq("publie" as never, true)
      .eq("statut" as never, "publie")
      .is("deleted_at" as never, null)
      .maybeSingle();

    if (error || !data) return fallback;
    return mapRow(data as unknown as ArchiveEventRow);
  });
}
