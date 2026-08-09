import { createClientSafe } from "@/lib/supabase/safe";

export type AdminEventArchiveImage = {
  id: string;
  title: string | null;
  caption: string | null;
  alt_text: string;
  public_url: string | null;
  local_asset_path: string | null;
  is_cover: boolean;
  order_index: number;
};

export type AdminEventArchive = {
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
  statut: string;
  publie: boolean;
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  actualites?: { slug: string; title: string } | null;
  bibliotheque_images?: AdminEventArchiveImage[] | null;
  updated_at: string;
  created_at: string;
};

export async function getAdminEventArchives(filters: {
  q?: string;
  status?: string;
  domain?: string;
} = {}): Promise<AdminEventArchive[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];

    let query = supabase
      .from("bibliotheque_evenements" as never)
      .select(
        "id, slug, titre, resume, description, domaine_slug, date_evenement, heure_debut, heure_fin, lieu_nom, adresse, province, territoire, localite, latitude, longitude, tags, cover_image_url, statut, publie, featured, seo_title, seo_description, updated_at, created_at, actualites(slug, title), bibliotheque_images(id, title, caption, alt_text, public_url, local_asset_path, is_cover, order_index)" as never,
      )
      .is("deleted_at" as never, null)
      .order("updated_at" as never, { ascending: false });

    if (filters.q?.trim()) {
      const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
      query = query.or(`titre.ilike.%${q}%,resume.ilike.%${q}%,lieu_nom.ilike.%${q}%` as never);
    }
    if (filters.status?.trim()) {
      query = query.eq("statut" as never, filters.status.trim());
    }
    if (filters.domain?.trim()) {
      query = query.eq("domaine_slug" as never, filters.domain.trim());
    }

    const { data, error } = await query;
    if (error || !data || !Array.isArray(data)) return [];
    return data as unknown as AdminEventArchive[];
  } catch {
    return [];
  }
}

export async function getAdminEventArchive(
  id: string,
): Promise<AdminEventArchive | null> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("bibliotheque_evenements" as never)
      .select(
        "id, slug, titre, resume, description, domaine_slug, date_evenement, heure_debut, heure_fin, lieu_nom, adresse, province, territoire, localite, latitude, longitude, tags, cover_image_url, statut, publie, featured, seo_title, seo_description, updated_at, created_at, actualites(slug, title), bibliotheque_images(id, title, caption, alt_text, public_url, local_asset_path, is_cover, order_index)" as never,
      )
      .eq("id" as never, id)
      .is("deleted_at" as never, null)
      .maybeSingle();

    if (error || !data) return null;
    const item = data as unknown as AdminEventArchive;
    return {
      ...item,
      bibliotheque_images: [...(item.bibliotheque_images ?? [])].sort(
        (a, b) => a.order_index - b.order_index,
      ),
    };
  } catch {
    return null;
  }
}
