import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export type GlobalSearchHit = {
  module: string;
  id: string;
  title: string;
  href: string;
  meta?: string;
};

export async function searchAdminGlobal(
  supabase: SupabaseClient,
  q: string,
  allowed: {
    programmes?: boolean;
    projets?: boolean;
    activites?: boolean;
    urgences?: boolean;
    partenaires?: boolean;
  },
): Promise<GlobalSearchHit[]> {
  const term = q.trim().replace(/[%_,]/g, " ").slice(0, 80);
  if (term.length < 2) return [];
  const pattern = `%${term}%`;
  const hits: GlobalSearchHit[] = [];

  if (allowed.programmes) {
    const { data } = await supabase
      .from("programmes")
      .select("id, title")
      .ilike("title", pattern)
      .limit(8);
    for (const row of data ?? []) {
      hits.push({
        module: "Programmes",
        id: row.id,
        title: row.title,
        href: `/admin/programmes/${row.id}/analyse`,
      });
    }
  }

  if (allowed.projets) {
    const { data } = await supabase
      .from("projets")
      .select("id, title")
      .ilike("title", pattern)
      .limit(8);
    for (const row of data ?? []) {
      hits.push({
        module: "Projets",
        id: row.id,
        title: row.title,
        href: `/admin/projets/${row.id}`,
      });
    }
  }

  if (allowed.activites) {
    const { data } = await supabase
      .from("activites" as never)
      .select("id, title, province")
      .ilike("title", pattern)
      .limit(8);
    for (const row of (data ?? []) as Array<{ id: string; title: string; province: string | null }>) {
      hits.push({
        module: "Activités",
        id: row.id,
        title: row.title,
        href: `/admin/activites/${row.id}`,
        meta: row.province ?? undefined,
      });
    }
  }

  if (allowed.urgences) {
    const { data } = await supabase
      .from("urgences" as never)
      .select("id, title, province")
      .ilike("title", pattern)
      .limit(8);
    for (const row of (data ?? []) as Array<{ id: string; title: string; province: string | null }>) {
      hits.push({
        module: "Urgences",
        id: row.id,
        title: row.title,
        href: `/admin/urgences/${row.id}`,
        meta: row.province ?? undefined,
      });
    }
  }

  if (allowed.partenaires) {
    const { data } = await supabase
      .from("partenaires")
      .select("id, name")
      .ilike("name", pattern)
      .limit(8);
    for (const row of data ?? []) {
      hits.push({
        module: "Partenaires",
        id: row.id,
        title: row.name,
        href: `/admin/partenaires/${row.id}`,
      });
    }
  }

  return hits;
}
