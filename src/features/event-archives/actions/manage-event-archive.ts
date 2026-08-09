"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hasPermission } from "@/lib/auth/has-permission";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const statusSchema = z.enum([
  "brouillon",
  "en_revision",
  "approuve",
  "programme",
  "publie",
  "depublie",
  "archive",
]);

const archiveSchema = z.object({
  titre: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  domaine_slug: z.string().min(3),
  resume: z.string().optional(),
  description: z.string().optional(),
  date_evenement: z.string().optional(),
  heure_debut: z.string().optional(),
  heure_fin: z.string().optional(),
  lieu_nom: z.string().optional(),
  adresse: z.string().optional(),
  province: z.string().optional(),
  territoire: z.string().optional(),
  localite: z.string().optional(),
  latitude: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.coerce.number().optional(),
  ),
  longitude: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.coerce.number().optional(),
  ),
  tags: z.string().optional(),
  cover_image_url: z.string().optional(),
  related_article_slug: z.string().optional(),
  statut: statusSchema,
  publie: z.string().optional(),
  featured: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  image_lines: z.string().optional(),
});

const ARCHIVE_BUCKET = "afd-archives";
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function emptyToNull(value?: string): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function optionalNumber(value: number | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeLocalAsset(value: string): string {
  return value.startsWith("/assets/") ? decodeURI(value) : value;
}

function slugifyFile(value: string): string {
  const base = value.replace(/\.[^.]+$/, "");
  return (
    base
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "image"
  );
}

function parseTags(value?: string): string[] {
  return (value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function parseImageLines(params: {
  cover: string | null;
  lines?: string;
  title: string;
  domainSlug: string;
}) {
  const rows = (params.lines ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (params.cover && !rows.some((line) => line.split("|")[0]?.trim() === params.cover)) {
    rows.unshift(`${params.cover}|Image de couverture|${params.title}`);
  }

  return rows.slice(0, 60).map((line, index) => {
    const [rawSrc, rawTitle, rawCaption, rawAlt] = line.split("|").map((part) => part?.trim());
    const src = normalizeLocalAsset(rawSrc ?? "");
    const isLocal = src.startsWith("/assets/");
    return {
      domaine_slug: params.domainSlug,
      title: rawTitle || params.title,
      caption: rawCaption || null,
      alt_text: rawAlt || rawCaption || rawTitle || params.title,
      public_url: isLocal ? null : src,
      local_asset_path: isLocal ? src : null,
      is_cover: index === 0,
      order_index: index + 1,
      consent_status: "to-review",
      visibility: "public",
      source: "dashboard-admin",
    };
  });
}

function selectedFiles(formData: FormData): File[] {
  return formData
    .getAll("archive_files")
    .filter((value): value is File => value instanceof File && value.size > 0)
    .filter((file) => file.size <= MAX_IMAGE_BYTES && ALLOWED_IMAGE_TYPES.has(file.type));
}

async function uploadArchiveImages(params: {
  supabase: NonNullable<Awaited<ReturnType<typeof createClientSafe>>>;
  eventId: string;
  files: File[];
  domainSlug: string;
  title: string;
  startIndex: number;
}) {
  const uploaded = [];
  for (const [offset, file] of params.files.entries()) {
    const ext =
      file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : file.type === "image/avif"
            ? "avif"
            : "jpg";
    const storagePath = `${params.eventId}/${Date.now()}-${offset + 1}-${slugifyFile(file.name)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await params.supabase.storage
      .from(ARCHIVE_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: "3600",
      });

    if (error) continue;

    const { data } = params.supabase.storage
      .from(ARCHIVE_BUCKET)
      .getPublicUrl(storagePath);

    uploaded.push({
      domaine_slug: params.domainSlug,
      title: file.name,
      caption: null,
      alt_text: params.title,
      storage_bucket: ARCHIVE_BUCKET,
      storage_path: storagePath,
      public_url: data.publicUrl,
      is_cover: params.startIndex === 0 && offset === 0,
      order_index: params.startIndex + offset + 1,
      consent_status: "to-review",
      visibility: "public",
      source: "dashboard-upload",
    });
  }
  return uploaded;
}

async function resolveActualiteId(
  supabase: NonNullable<Awaited<ReturnType<typeof createClientSafe>>>,
  slug: string | null,
): Promise<string | null> {
  if (!slug) return null;
  const { data, error } = await supabase
    .from("actualites" as never)
    .select("id")
    .eq("slug" as never, slug)
    .maybeSingle();
  if (error || !data) return null;
  return (data as { id: string }).id;
}

async function resolveDomainId(
  supabase: NonNullable<Awaited<ReturnType<typeof createClientSafe>>>,
  slug: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("domaines_intervention" as never)
    .select("id")
    .eq("slug" as never, slug)
    .maybeSingle();
  if (error || !data) return null;
  return (data as { id: string }).id;
}

export async function saveEventArchive(formData: FormData) {
  const session = await requirePermission("archives:write");
  const parsed = archiveSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const published = parsed.data.publie === "on";
  if (published) {
    const canPublish = await hasPermission(session.user.id, "archives:publish");
    if (!canPublish) return;
  }

  const id = String(formData.get("id") || "");
  const relatedArticleSlug = emptyToNull(parsed.data.related_article_slug);
  const [actualiteId, domaineId] = await Promise.all([
    resolveActualiteId(supabase, relatedArticleSlug),
    resolveDomainId(supabase, parsed.data.domaine_slug),
  ]);

  const cover = emptyToNull(parsed.data.cover_image_url);
  const payload = {
    titre: parsed.data.titre,
    slug: parsed.data.slug,
    domaine_slug: parsed.data.domaine_slug,
    domaine_id: domaineId,
    actualite_id: actualiteId,
    resume: emptyToNull(parsed.data.resume),
    description: emptyToNull(parsed.data.description),
    date_evenement: emptyToNull(parsed.data.date_evenement),
    heure_debut: emptyToNull(parsed.data.heure_debut),
    heure_fin: emptyToNull(parsed.data.heure_fin),
    lieu_nom: emptyToNull(parsed.data.lieu_nom),
    adresse: emptyToNull(parsed.data.adresse),
    province: emptyToNull(parsed.data.province),
    territoire: emptyToNull(parsed.data.territoire),
    localite: emptyToNull(parsed.data.localite),
    latitude: optionalNumber(parsed.data.latitude),
    longitude: optionalNumber(parsed.data.longitude),
    tags: parseTags(parsed.data.tags),
    cover_image_url: cover,
    statut: published ? "publie" : parsed.data.statut,
    publie: published,
    featured: parsed.data.featured === "on",
    seo_title: emptyToNull(parsed.data.seo_title),
    seo_description: emptyToNull(parsed.data.seo_description),
    published_at: published ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
    source: "dashboard-admin",
  };

  let eventId = id;
  if (eventId) {
    await supabase
      .from("bibliotheque_evenements" as never)
      .update(payload as never)
      .eq("id" as never, eventId);
  } else {
    const { data, error } = await supabase
      .from("bibliotheque_evenements" as never)
      .insert({ ...payload, created_by: session.user.id } as never)
      .select("id")
      .single();
    if (error || !data) return;
    eventId = (data as { id: string }).id;
  }

  const images = parseImageLines({
    cover,
    lines: parsed.data.image_lines,
    title: parsed.data.titre,
    domainSlug: parsed.data.domaine_slug,
  });
  const uploadedImages = await uploadArchiveImages({
    supabase,
    eventId,
    files: selectedFiles(formData),
    domainSlug: parsed.data.domaine_slug,
    title: parsed.data.titre,
    startIndex: images.length,
  });
  const allImages = [...images, ...uploadedImages];

  await supabase
    .from("bibliotheque_images" as never)
    .delete()
    .eq("evenement_id" as never, eventId);

  if (allImages.length > 0) {
    await supabase.from("bibliotheque_images" as never).insert(
      allImages.map((image) => ({
        ...image,
        evenement_id: eventId,
        created_by: session.user.id,
      })) as never,
    );
  }

  revalidatePath("/");
  revalidatePath("/actions/domaines-intervention");
  revalidatePath(`/actions/domaines-intervention/${parsed.data.domaine_slug}`);
  revalidatePath("/admin/publications/archives");
  redirect("/admin/publications/archives");
}

export async function softDeleteEventArchive(formData: FormData) {
  await requirePermission("archives:write");
  const id = String(formData.get("id") || "");
  if (!z.string().uuid().safeParse(id).success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  await supabase
    .from("bibliotheque_evenements" as never)
    .update({
      deleted_at: new Date().toISOString(),
      statut: "archive",
      publie: false,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id" as never, id);

  revalidatePath("/admin/publications/archives");
  revalidatePath("/actions/domaines-intervention");
}
