import { supabase } from '../lib/supabase';
import type { Project } from '../types';

export interface DashboardMetrics {
  programmesActifs: number | null;
  projetsEnCours: number | null;
  projetsTermines: number | null;
  beneficiaires: number | null;
  actualitesPubliees: number | null;
  adhesionsEnAttente: number | null;
  messagesNonTraites: number | null;
  intentionsDons: number | null;
  partenairesActifs: number | null;
  projectsByStatus: Array<{ label: string; value: number }>;
  projectsByProgram: Array<{ label: string; value: number }>;
  errors: string[];
}

async function count(table: string, column?: string, value?: string | boolean, negate = false) {
  let query = supabase.from(table).select('*', { count: 'exact', head: true });
  if (column) query = negate ? query.neq(column, value ?? '') : query.eq(column, value ?? '');
  const { count: total, error } = await query;
  return { value: error ? null : total ?? 0, error: error?.message };
}

export async function loadDashboardMetrics(): Promise<DashboardMetrics> {
  const [
    programmes, projectsCurrent, projectsFinished, news, memberships, messages,
    donations, partners, projectsData, settings,
  ] = await Promise.all([
    count('programmes', 'active', true),
    count('projets', 'status', 'en_cours'),
    count('projets', 'status', 'termine'),
    count('actualites', 'published', true),
    count('membres', 'status', 'pending'),
    count('messages', 'status', 'unread'),
    count('dons', 'status', 'confirmed', true),
    count('partenaires', 'active', true),
    supabase.from('projets').select('status, program_id'),
    supabase.from('parametres_site').select('key, value').eq('key', 'beneficiaries').maybeSingle(),
  ]);

  const errors = [programmes, projectsCurrent, projectsFinished, news, memberships, messages, donations, partners]
    .map((result) => result.error)
    .filter((error): error is string => Boolean(error));
  if (projectsData.error) errors.push(projectsData.error.message);
  if (settings.error) errors.push(settings.error.message);
  const projects = (projectsData.data ?? []) as Pick<Project, 'status' | 'program_id'>[];
  const statusLabels: Record<Project['status'], string> = { en_cours: 'En cours', termine: 'Terminés', futur: 'Planifiés' };
  const projectsByStatus = (Object.keys(statusLabels) as Project['status'][]).map((status) => ({ label: statusLabels[status], value: projects.filter((project) => project.status === status).length }));
  const projectsByProgram = Array.from(new Map(projects.filter((project) => project.program_id).map((project) => [project.program_id, 0])).entries()).map(([label]) => ({ label: `Programme ${label.slice(0, 8)}`, value: projects.filter((project) => project.program_id === label).length }));
  const beneficiaries = settings.data?.value ? Number(settings.data.value) : null;
  return {
    programmesActifs: programmes.value, projetsEnCours: projectsCurrent.value, projetsTermines: projectsFinished.value,
    beneficiaires: Number.isFinite(beneficiaries) ? beneficiaries : null, actualitesPubliees: news.value,
    adhesionsEnAttente: memberships.value, messagesNonTraites: messages.value, intentionsDons: donations.value,
    partenairesActifs: partners.value, projectsByStatus, projectsByProgram, errors,
  };
}
