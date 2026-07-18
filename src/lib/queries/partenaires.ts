import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import {
  LEGACY_PARTNERS,
  type LegacyPartnerRecord,
} from "@/config/legacy-partners";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { createClientSafe } from "@/lib/supabase/safe";
import type { Database } from "@/types/database.types";

export type PublicPartner = {
  id: string;
  name: string;
  acronyme: string | null;
  slug: string | null;
  logo_url: string | null;
  category: string | null;
  website_url: string | null;
  description: string | null;
  order: number | null;
};

function fromLegacy(record: LegacyPartnerRecord): PublicPartner {
  return {
    id: record.id,
    name: record.name,
    acronyme: record.acronyme,
    slug: record.slug,
    logo_url: record.logoLocalPath,
    category: record.category,
    website_url: record.websiteUrl,
    description: record.description,
    order: record.order,
  };
}

function createPublicAnonClient() {
  const env = getSupabasePublicEnv();
  if (!env) return null;
  return createClient<Database>(env.url, env.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function fetchActivePublicPartners(): Promise<PublicPartner[]> {
  try {
    const supabase = createPublicAnonClient();
    if (!supabase) {
      return LEGACY_PARTNERS.map(fromLegacy);
    }

    const { data, error } = await supabase
      .from("partenaires")
      .select(
        "id, name, acronyme, slug, logo_url, category, website_url, description, order",
      )
      .eq("active", true)
      .eq("publie", true)
      .is("deleted_at", null)
      .order("order", { ascending: true });

    if (error) {
      // Colonnes enrichies absentes (migration non appliquée) → requête minimale
      const fallback = await supabase
        .from("partenaires")
        .select("id, name, logo_url, category, order")
        .eq("active", true)
        .order("order", { ascending: true });

      if (fallback.error || !fallback.data?.length) {
        return LEGACY_PARTNERS.map(fromLegacy);
      }

      return fallback.data.map((row) => ({
        id: row.id,
        name: row.name,
        acronyme: null,
        slug: null,
        logo_url: row.logo_url,
        category: row.category,
        website_url: null,
        description: null,
        order: row.order,
      }));
    }

    if (!data?.length) {
      return LEGACY_PARTNERS.map(fromLegacy);
    }

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      acronyme: row.acronyme ?? null,
      slug: row.slug ?? null,
      logo_url: row.logo_url,
      category: row.category,
      website_url: row.website_url ?? null,
      description: row.description ?? null,
      order: row.order,
    }));
  } catch {
    return LEGACY_PARTNERS.map(fromLegacy);
  }
}

export async function getActivePublicPartners(): Promise<PublicPartner[]> {
  return unstable_cache(fetchActivePublicPartners, ["partenaires-public"], {
    tags: ["partenaires"],
    revalidate: 300,
  })();
}

export async function getAdminPartners(options?: {
  q?: string;
  includeArchived?: boolean;
}) {
  const supabase = await createClientSafe();
  if (!supabase) return [];

  let query = supabase
    .from("partenaires")
    .select(
      "id, name, acronyme, slug, logo_url, category, website_url, description, order, active, publie, mise_en_avant, deleted_at, created_at, updated_at",
    )
    .order("order", { ascending: true });

  if (!options?.includeArchived) {
    query = query.is("deleted_at", null);
  }

  const { data, error } = await query;
  if (error || !data) {
    const minimal = await supabase
      .from("partenaires")
      .select("id, name, logo_url, category, order, active, created_at")
      .order("order", { ascending: true });
    return (minimal.data ?? []).map((row) => ({
      ...row,
      acronyme: null,
      slug: null,
      website_url: null,
      description: null,
      publie: row.active,
      mise_en_avant: false,
      deleted_at: null,
      updated_at: null,
    }));
  }

  const q = options?.q?.trim().toLowerCase();
  if (!q) return data;
  return data.filter(
    (row) =>
      row.name.toLowerCase().includes(q) ||
      (row.acronyme?.toLowerCase().includes(q) ?? false) ||
      (row.slug?.toLowerCase().includes(q) ?? false),
  );
}

export async function getAdminPartnerById(id: string) {
  const supabase = await createClientSafe();
  if (!supabase) return null;
  const { data } = await supabase
    .from("partenaires")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}
