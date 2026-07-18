import { createClientSafe } from "@/lib/supabase/safe";

export type MediaRecord = {
  id: string;
  bucket: string;
  storage_path: string;
  filename: string;
  original_filename: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  credit: string | null;
  consent_status: string;
  visibility: string;
  created_at: string;
  publicUrl: string | null;
};

export async function listMedia(params?: {
  bucket?: string;
  q?: string;
  limit?: number;
}): Promise<MediaRecord[]> {
  const supabase = await createClientSafe();
  if (!supabase) return [];

  let query = supabase
    .from("medias" as never)
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(params?.limit ?? 48);

  if (params?.bucket) {
    query = query.eq("bucket" as never, params.bucket);
  }
  if (params?.q?.trim()) {
    query = query.or(
      `filename.ilike.%${params.q.trim()}%,alt_text.ilike.%${params.q.trim()}%,original_filename.ilike.%${params.q.trim()}%` as never,
    );
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return (data as MediaRecord[]).map((row) => {
    const { data: urlData } = supabase.storage
      .from(row.bucket)
      .getPublicUrl(row.storage_path);
    return {
      ...row,
      publicUrl: urlData.publicUrl ?? null,
    };
  });
}

export function getPublicMediaUrl(bucket: string, path: string): string | null {
  // Placeholder technique — résolution réelle via client Supabase côté serveur.
  if (!bucket || !path) return null;
  return `${bucket}/${path}`;
}
