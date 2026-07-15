import { Link, useLocation } from 'react-router-dom';
import { Database, ShieldCheck } from 'lucide-react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { Card, EmptyState } from '../../components/ui';

const modules: Record<string, { title: string; description: string }> = {
  '/admin/equipe': { title: 'Gestion de l’équipe', description: 'Ce module sera connecté à la table membres_equipe après validation des droits d’écriture.' },
  '/admin/clusters': { title: 'Gestion des clusters', description: 'Ce module est préparé pour la table clusters et ses actions associées.' },
  '/admin/mediatheque': { title: 'Médiathèque', description: 'La gestion existante de la galerie reste disponible. Les documents et vidéos nécessitent un schéma et des politiques Storage validés.' },
  '/admin/messages': { title: 'Messages', description: 'La lecture et le suivi nécessitent des politiques RLS administrateur sur la table messages.' },
  '/admin/adhesions': { title: 'Adhésions', description: 'La gestion existante des membres reste disponible. Les statuts étendus et notes internes nécessitent des colonnes validées.' },
  '/admin/dons': { title: 'Intentions de dons', description: 'Aucun paiement confirmé n’est enregistré par le système. Ce module ne doit traiter que des intentions jusqu’à l’intégration d’un prestataire.' },
  '/admin/statistiques': { title: 'Statistiques', description: 'Les statistiques accessibles sont présentées sur le tableau de bord. Les analyses détaillées nécessitent des agrégations backend.' },
  '/admin/rapports': { title: 'Rapports', description: 'Le générateur de rapports nécessite une table de stockage, des sources validées et une stratégie PDF serveur ou navigateur.' },
};

export default function AdminModulePlaceholder() {
  const location = useLocation();
  const module = modules[location.pathname] ?? { title: 'Module en préparation', description: 'Ce module est en cours de préparation.' };
  return <LayoutAdmin><div className="mx-auto max-w-4xl"><div className="rounded-2xl bg-brand-deep p-8 text-white"><p className="text-sm font-bold uppercase tracking-[.16em] text-brand-gold">Administration</p><h1 className="mt-3 text-3xl font-bold">{module.title}</h1><p className="mt-3 max-w-2xl text-white/75">{module.description}</p></div><Card className="mt-7 p-7"><div className="flex gap-4"><Database className="h-6 w-6 shrink-0 text-brand-emerald" /><div><h2 className="font-bold">Données réelles uniquement</h2><p className="mt-2 text-sm leading-6 text-brand-muted">Ce module ne crée aucune donnée de démonstration et n’affiche pas de valeurs inventées. Son activation dépend de la validation du schéma et des droits Supabase.</p></div></div><div className="mt-6 flex gap-4"><Link to="/admin/dashboard" className="text-sm font-bold text-brand-deep">Voir les indicateurs disponibles</Link><Link to="/admin/parametres" className="text-sm font-bold text-brand-emerald">Paramètres du site</Link></div></Card><div className="mt-7"><EmptyState title="Aucune donnée administrable dans ce module" description="La source de données sera connectée lorsque les colonnes et politiques nécessaires auront été validées." /></div><div className="mt-7 flex gap-3 rounded-xl border border-brand-gold/40 bg-brand-sand p-4 text-sm text-brand-ink"><ShieldCheck className="h-5 w-5 shrink-0" />Préparé pour une sécurisation par rôles et politiques RLS, sans contournement côté client.</div></div></LayoutAdmin>;
}
