import { useCallback } from 'react';
import { FileText, FolderKanban, HandCoins, Mail, Newspaper, Users } from 'lucide-react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { ChartCard, DataQualityWarning, StatCard } from '../../components/admin';
import { LoadingState } from '../../components/ui';
import { useContentResource } from '../../hooks/useContentResource';
import { loadDashboardMetrics, type DashboardMetrics } from '../../services/dashboardService';

const initialMetrics: DashboardMetrics = {
  programmesActifs: null, projetsEnCours: null, projetsTermines: null, beneficiaires: null,
  actualitesPubliees: null, adhesionsEnAttente: null, messagesNonTraites: null, intentionsDons: null,
  partenairesActifs: null, projectsByStatus: [], projectsByProgram: [], errors: [],
};

export default function AdminDashboardV2() {
  const loader = useCallback(async () => ({ data: await loadDashboardMetrics(), error: null, isFallback: false }), []);
  const { data: metrics, loading } = useContentResource(loader, initialMetrics);
  return <LayoutAdmin><div className="mx-auto max-w-7xl space-y-7"><div><p className="text-sm font-bold uppercase tracking-[.16em] text-brand-emerald">Pilotage</p><h1 className="mt-2 text-3xl font-bold text-brand-ink">Tableau de bord</h1><p className="mt-2 text-brand-muted">Synthèse des données réellement accessibles depuis Supabase. Les paiements confirmés ne sont pas affichés : le système ne dispose pas encore de confirmation de prestataire.</p></div>{loading ? <LoadingState label="Chargement des indicateurs…" /> : <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard title="Programmes actifs" value={metrics.programmesActifs} icon={<FolderKanban className="h-5 w-5" />} href="/admin/programmes" /><StatCard title="Projets en cours" value={metrics.projetsEnCours} icon={<FolderKanban className="h-5 w-5" />} href="/admin/projets" /><StatCard title="Projets terminés" value={metrics.projetsTermines} icon={<FileText className="h-5 w-5" />} href="/admin/projets" /><StatCard title="Bénéficiaires déclarés" value={metrics.beneficiaires} icon={<Users className="h-5 w-5" />} note="Valeur agrégée des paramètres du site." /><StatCard title="Actualités publiées" value={metrics.actualitesPubliees} icon={<Newspaper className="h-5 w-5" />} href="/admin/actualites" /><StatCard title="Adhésions en attente" value={metrics.adhesionsEnAttente} icon={<Users className="h-5 w-5" />} href="/admin/adhesions" /><StatCard title="Messages non traités" value={metrics.messagesNonTraites} icon={<Mail className="h-5 w-5" />} href="/admin/messages" /><StatCard title="Intentions de dons" value={metrics.intentionsDons} icon={<HandCoins className="h-5 w-5" />} href="/admin/dons" /></div>{metrics.errors.length > 0 && <DataQualityWarning message="Certaines sources ne sont pas encore accessibles avec les politiques actuelles. Les indicateurs indisponibles sont affichés avec un tiret." />}<div className="grid gap-6 lg:grid-cols-2"><ChartCard title="Répartition des projets par statut" description="Calculée à partir des projets enregistrés." data={metrics.projectsByStatus} /><ChartCard title="Projets par programme" description="Calculée à partir des associations disponibles." data={metrics.projectsByProgram} /></div><DataQualityWarning message="Les séries d’évolution, les bénéficiaires par province, les paiements confirmés, les dépenses et les statistiques de communication nécessitent des colonnes ou agrégations backend supplémentaires. Aucun résultat n’est simulé." /></>}</div></LayoutAdmin>;
}
