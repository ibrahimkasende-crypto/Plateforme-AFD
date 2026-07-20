"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClientSafe } from "@/lib/supabase/safe";
import { appendAuditLog } from "@/features/identity/services/audit.service";

const AVATAR_BUCKET = "admin-avatars";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

/**
 * Chemin compatible avec la policy Storage :
 * (storage.foldername(name))[1] = auth.uid()
 */
function avatarPathFor(userId: string, ext: string): string {
  return `${userId}/processed/avatar.${ext}`;
}

export async function uploadAvatarAction(formData: FormData): Promise<void> {
  const session = await requireAdmin("/admin/mon-profil");
  const file = formData.get("avatar");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Aucun fichier sélectionné.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Fichier trop volumineux (max 5 Mo).");
  }
  if (!ALLOWED.has(file.type)) {
    throw new Error("Format non supporté (JPEG, PNG ou WebP).");
  }

  const supabase = await createClientSafe();
  if (!supabase) {
    throw new Error("Connexion Supabase indisponible.");
  }

  const ext =
    file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = avatarPathFor(session.user.id, ext);
  const buffer = Buffer.from(await file.arrayBuffer());

  // Supprimer l’ancien fichier pour éviter un upsert sans policy UPDATE
  await supabase.storage.from(AVATAR_BUCKET).remove([path]);

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
      cacheControl: "3600",
    });

  if (uploadError) {
    // Retry upsert si l’objet existe encore
    const { error: upsertError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true,
        cacheControl: "3600",
      });
    if (upsertError) {
      throw new Error(
        upsertError.message ||
          uploadError.message ||
          "Échec de l’upload vers le stockage.",
      );
    }
  }

  const { error: updateError } = await supabase
    .from("profils_administrateurs" as never)
    .update({
      avatar_bucket: AVATAR_BUCKET,
      avatar_path: path,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", session.user.id);

  if (updateError) {
    throw new Error(
      updateError.message || "Échec de la mise à jour du profil.",
    );
  }

  await appendAuditLog(supabase, {
    action: "profile.avatar.upload",
    module: "identity",
    entityType: "profils_administrateurs",
    entityId: session.user.id,
    sensitivity: "interne",
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mon-profil");
}

export async function removeAvatarAction(): Promise<void> {
  const session = await requireAdmin("/admin/mon-profil");
  const supabase = await createClientSafe();
  if (!supabase) {
    throw new Error("Connexion Supabase indisponible.");
  }

  const { data: profile } = await supabase
    .from("profils_administrateurs" as never)
    .select("avatar_path, avatar_bucket")
    .eq("id", session.user.id)
    .maybeSingle();

  const row = profile as {
    avatar_path?: string | null;
    avatar_bucket?: string | null;
  } | null;

  if (row?.avatar_path) {
    const bucket = row.avatar_bucket || AVATAR_BUCKET;
    await supabase.storage.from(bucket).remove([row.avatar_path]);
  }

  const { error } = await supabase
    .from("profils_administrateurs" as never)
    .update({
      avatar_path: null,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", session.user.id);

  if (error) {
    throw new Error(error.message || "Échec de la suppression.");
  }

  await appendAuditLog(supabase, {
    action: "profile.avatar.remove",
    module: "identity",
    entityType: "profils_administrateurs",
    entityId: session.user.id,
    sensitivity: "interne",
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mon-profil");
}

export async function getAvatarSignedUrl(
  bucket: string,
  path: string,
  expiresIn = 3600,
): Promise<string | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    if (error || !data?.signedUrl) return null;
    return data.signedUrl;
  } catch {
    return null;
  }
}
