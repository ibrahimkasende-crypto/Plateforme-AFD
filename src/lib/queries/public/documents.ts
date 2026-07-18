import type { DocumentCentre } from "@/features/documents/types";
import { withClient } from "./client";

export type PublishedDocument = DocumentCentre;

export type DocumentFilters = { type?: string; q?: string };

/** Retourne uniquement des documents réellement publiés; une table absente donne []. */
export async function getPublishedDocuments(
  filters: DocumentFilters = {},
): Promise<PublishedDocument[]> {
  return withClient([], async (supabase) => {
    let query = supabase
      .from("documents")
      .select("*")
      .eq("publie", true)
      .eq("niveau_confidentialite", "public")
      .is("deleted_at", null);
    if (filters.type?.trim()) query = query.ilike("type", `%${filters.type.trim()}%`);
    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`titre.ilike.%${q}%,description.ilike.%${q}%`);
    }
    const { data, error } = await query.order("date_publication", { ascending: false });
    return error || !data ? [] : data;
  });
}

export async function getDocumentBySlug(slug: string): Promise<PublishedDocument | null> {
  return withClient(null, async (supabase) => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("slug", slug)
      .eq("publie", true)
      .eq("niveau_confidentialite", "public")
      .is("deleted_at", null)
      .maybeSingle();
    return error || !data ? null : data;
  });
}
