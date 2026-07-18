"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { revalidatePartenairesCache } from "@/services/partenaires.service";

const schema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/)
    .optional()
    .or(z.literal("")),
  acronyme: z.string().optional(),
  category: z.string().optional(),
  website_url: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  logo_url: z.string().optional(),
  order: z.coerce.number().int().min(0).optional(),
  active: z.string().optional(),
  publie: z.string().optional(),
  mise_en_avant: z.string().optional(),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function savePartner(formData: FormData) {
  await requirePermission("partenaires:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const slug =
    parsed.data.slug && parsed.data.slug.length > 0
      ? parsed.data.slug
      : slugify(parsed.data.name);

  const payload = {
    name: parsed.data.name,
    slug,
    acronyme: parsed.data.acronyme || null,
    category: parsed.data.category || null,
    website_url: parsed.data.website_url || null,
    description: parsed.data.description || null,
    logo_url: parsed.data.logo_url || null,
    order: parsed.data.order ?? 0,
    active: parsed.data.active === "on",
    publie: parsed.data.publie === "on",
    mise_en_avant: parsed.data.mise_en_avant === "on",
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("partenaires").update(payload).eq("id", id);
  } else {
    await supabase.from("partenaires").insert(payload);
  }

  await revalidatePartenairesCache();
  revalidatePath("/admin/partenaires");
  redirect("/admin/partenaires");
}

async function setPartnerState(
  id: string,
  values: Record<string, unknown>,
) {
  await requirePermission("partenaires:write");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  await supabase
    .from("partenaires")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id);
  await revalidatePartenairesCache();
  revalidatePath("/admin/partenaires");
}

export async function publishPartner(id: string) {
  await setPartnerState(id, { publie: true, active: true });
}

export async function unpublishPartner(id: string) {
  await setPartnerState(id, { publie: false });
}

export async function activatePartner(id: string) {
  await setPartnerState(id, { active: true });
}

export async function deactivatePartner(id: string) {
  await setPartnerState(id, { active: false });
}

export async function archivePartner(id: string) {
  await setPartnerState(id, {
    deleted_at: new Date().toISOString(),
    active: false,
    publie: false,
  });
}

export async function restorePartner(id: string) {
  await setPartnerState(id, { deleted_at: null });
}

export async function updatePartnerOrder(id: string, order: number) {
  await setPartnerState(id, { order });
}

export async function togglePartnerPublish(id: string, publie: boolean) {
  if (publie) await unpublishPartner(id);
  else await publishPartner(id);
}

export async function uploadPartnerLogo(formData: FormData) {
  await requirePermission("partenaires:write");
  const id = String(formData.get("id") || "");
  const file = formData.get("logo");
  if (!z.string().uuid().safeParse(id).success || !(file instanceof File)) {
    return;
  }

  const supabase = await createClientSafe();
  if (!supabase) return;

  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const storagePath = `${id}/logo-principal.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("partenaires")
    .upload(storagePath, buffer, {
      contentType: file.type || "image/png",
      upsert: true,
    });

  if (error) return;

  const { data } = supabase.storage.from("partenaires").getPublicUrl(storagePath);

  const { data: existingMedia } = await supabase
    .from("medias")
    .select("id")
    .eq("bucket", "partenaires")
    .eq("storage_path", storagePath)
    .maybeSingle();

  const mediaPayload = {
    bucket: "partenaires",
    storage_path: storagePath,
    filename: `logo-principal.${ext}`,
    original_filename: file.name,
    mime_type: file.type || "image/png",
    size_bytes: file.size,
    alt_text: "Logo partenaire",
    visibility: "public" as const,
    resource_type: "partenaire",
    resource_id: id,
  };

  let mediaId = existingMedia?.id ?? null;
  if (mediaId) {
    await supabase.from("medias").update(mediaPayload).eq("id", mediaId);
  } else {
    const { data: inserted } = await supabase
      .from("medias")
      .insert(mediaPayload)
      .select("id")
      .maybeSingle();
    mediaId = inserted?.id ?? null;
  }

  await supabase
    .from("partenaires")
    .update({
      logo_url: data.publicUrl,
      logo_media_id: mediaId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  await revalidatePartenairesCache();
  revalidatePath(`/admin/partenaires/${id}`);
  revalidatePath(`/admin/partenaires/${id}/modifier`);
}
