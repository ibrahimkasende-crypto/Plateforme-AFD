"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClientSafe } from "@/lib/supabase/safe";
import { appendAuditLog } from "@/features/identity/services/audit.service";

const AVATAR_BUCKET = "admin-avatars";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

function avatarPathFor(userId: string, ext: string): string {
  return `avatars/${userId}/processed/avatar.${ext}`;
}

export async function uploadAvatarAction(formData: FormData): Promise<void> {
  const session = await requireAdmin("/admin/mon-profil");
  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) return;
  if (file.size > MAX_BYTES) return;
  if (!ALLOWED.has(file.type)) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const ext =
    file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = avatarPathFor(session.user.id, ext);
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) return;

  await supabase
    .from("profils_administrateurs" as never)
    .update({
      avatar_bucket: AVATAR_BUCKET,
      avatar_path: path,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", session.user.id);

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
  if (!supabase) return;

  const { data: profile } = await supabase
    .from("profils_administrateurs" as never)
    .select("avatar_path, avatar_bucket")
    .eq("id", session.user.id)
    .maybeSingle();

  const row = profile as { avatar_path?: string | null; avatar_bucket?: string | null } | null;
  if (row?.avatar_path) {
    const bucket = row.avatar_bucket || AVATAR_BUCKET;
    await supabase.storage.from(bucket).remove([row.avatar_path]);
  }

  await supabase
    .from("profils_administrateurs" as never)
    .update({
      avatar_path: null,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", session.user.id);

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
  const supabase = await createClientSafe();
  if (!supabase) return null;
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
