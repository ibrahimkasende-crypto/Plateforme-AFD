import { queryWithRetry, supabase, type QueryError } from '../lib/supabase';
import {
  fallbackClusters,
  fallbackNews,
  fallbackPartners,
  fallbackPrograms,
  fallbackProjects,
  fallbackSettings,
  fallbackTeam,
} from '../lib/fallbackData';
import type { Cluster, GalleryItem, News, Partner, Program, Project, TeamMember } from '../types';

export interface ContentResult<T> {
  data: T;
  error: QueryError | null;
  isFallback: boolean;
}

async function loadCollection<T>(
  query: () => PromiseLike<{ data: T[] | null; error: QueryError | null }>,
  fallback: T[],
): Promise<ContentResult<T[]>> {
  const { data, error } = await queryWithRetry(query);
  if (data?.length) return { data, error: null, isFallback: false };
  return { data: fallback, error, isFallback: true };
}

export const programmeService = {
  list: () => loadCollection<Program>(
    () => supabase.from('programmes').select('*').eq('active', true).order('order'),
    fallbackPrograms,
  ),
  async bySlug(slug: string): Promise<ContentResult<Program | undefined>> {
    const { data, error } = await queryWithRetry(() => supabase.from('programmes').select('*').eq('slug', slug).eq('active', true).maybeSingle());
    const fallback = fallbackPrograms.find((item) => item.slug === slug);
    return { data: (data as Program | null) ?? fallback, error, isFallback: !data };
  },
};

export const projetService = {
  list: () => loadCollection<Project>(
    () => supabase.from('projets').select('*').eq('active', true).order('created_at', { ascending: false }),
    fallbackProjects,
  ),
  async bySlug(slug: string): Promise<ContentResult<Project | undefined>> {
    const { data, error } = await queryWithRetry(() => supabase.from('projets').select('*').eq('slug', slug).eq('active', true).maybeSingle());
    const fallback = fallbackProjects.find((item) => item.slug === slug);
    return { data: (data as Project | null) ?? fallback, error, isFallback: !data };
  },
};

export const actualiteService = {
  list: () => loadCollection<News>(
    () => supabase.from('actualites').select('*').eq('published', true).order('published_at', { ascending: false }),
    fallbackNews,
  ),
  async bySlug(slug: string): Promise<ContentResult<News | undefined>> {
    const { data, error } = await queryWithRetry(() => supabase.from('actualites').select('*').eq('slug', slug).eq('published', true).maybeSingle());
    const fallback = fallbackNews.find((item) => item.slug === slug);
    return { data: (data as News | null) ?? fallback, error, isFallback: !data };
  },
};

export const equipeService = {
  list: () => loadCollection<TeamMember>(
    () => supabase.from('membres_equipe').select('*').eq('active', true).order('order'),
    fallbackTeam,
  ),
};

export const partenaireService = {
  list: () => loadCollection<Partner>(
    () => supabase.from('partenaires').select('*').eq('active', true).order('order'),
    fallbackPartners,
  ),
};

export const clusterService = {
  list: () => loadCollection<Cluster>(
    () => supabase.from('clusters').select('*').eq('active', true).order('order'),
    fallbackClusters,
  ),
};

export const mediaService = {
  list: () => loadCollection<GalleryItem>(
    () => supabase.from('galerie').select('*').eq('active', true).order('created_at', { ascending: false }),
    [],
  ),
};

export async function loadSettings(): Promise<ContentResult<Record<string, string>>> {
  const { data, error } = await queryWithRetry(() => supabase.from('parametres_site').select('*'));
  if (data?.length) {
    return { data: Object.fromEntries(data.map((setting) => [setting.key, setting.value])), error: null, isFallback: false };
  }
  return { data: fallbackSettings, error, isFallback: true };
}
