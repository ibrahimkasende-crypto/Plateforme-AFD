import { type ReactNode, useMemo, useState } from 'react';
import { Bell, ChevronDown, ChevronLeft, ChevronRight, FolderKanban, Image, LayoutDashboard, LogOut, Menu, Newspaper, Settings, Users } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/adf-logo.jpg';
import { Drawer, IconButton, cn } from '../components/ui';
import { useAuth } from '../admin/contextes/ContexteAuth';

interface AdminLayoutProps { children: ReactNode }
interface AdminNavItem { label: string; to: string; icon: typeof LayoutDashboard; group: string }

const navItems: AdminNavItem[] = [
  { label: 'Tableau de bord', to: '/admin/dashboard', icon: LayoutDashboard, group: 'Vue d’ensemble' },
  { label: 'Programmes', to: '/admin/programmes', icon: FolderKanban, group: 'Contenus' },
  { label: 'Projets', to: '/admin/projets', icon: FolderKanban, group: 'Contenus' },
  { label: 'Actualités', to: '/admin/actualites', icon: Newspaper, group: 'Contenus' },
  { label: 'Équipe', to: '/admin/equipe', icon: Users, group: 'Organisation' },
  { label: 'Partenaires', to: '/admin/partenaires', icon: Users, group: 'Organisation' },
  { label: 'Clusters', to: '/admin/clusters', icon: FolderKanban, group: 'Organisation' },
  { label: 'Médiathèque', to: '/admin/mediatheque', icon: Image, group: 'Médiathèque' },
  { label: 'Messages', to: '/admin/messages', icon: Newspaper, group: 'Demandes' },
  { label: 'Adhésions', to: '/admin/adhesions', icon: Users, group: 'Demandes' },
  { label: 'Intentions de dons', to: '/admin/dons', icon: FolderKanban, group: 'Demandes' },
  { label: 'Statistiques', to: '/admin/statistiques', icon: LayoutDashboard, group: 'Pilotage' },
  { label: 'Rapports', to: '/admin/rapports', icon: Newspaper, group: 'Pilotage' },
  { label: 'Paramètres', to: '/admin/parametres', icon: Settings, group: 'Administration' },
];

function UserInitials({ email }: { email?: string }) {
  const initials = (email ?? 'AFD').split('@')[0].split(/[.\s_-]+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  return <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-aubergine text-xs font-bold text-white">{initials}</span>;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { administrateur, seDeconnecter } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const groups = useMemo(() => [...new Set(navItems.map((item) => item.group))], []);
  const logout = async () => { await seDeconnecter(); navigate('/admin/login', { replace: true }); };
  const sidebar = <aside className={cn('flex h-full flex-col bg-brand-ink text-white transition-all', collapsed ? 'w-20' : 'w-72')}><div className="flex h-20 items-center gap-3 border-b border-white/10 px-5"><img src={logo} alt="AFD" className="h-10 w-10 rounded-full object-cover" />{!collapsed && <span><strong className="block">AFD</strong><small className="text-white/60">Administration</small></span>}<IconButton className="ml-auto hidden text-white hover:bg-white/10 lg:inline-flex" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? 'Agrandir le menu' : 'Réduire le menu'}>{collapsed ? <ChevronRight /> : <ChevronLeft />}</IconButton></div><nav className="flex-1 overflow-y-auto px-3 py-5">{groups.map((group) => <div key={group} className="mb-5">{!collapsed && <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[.16em] text-white/45">{group}</p>}{navItems.filter((item) => item.group === group).map((item) => { const Icon = item.icon; const active = location.pathname === item.to || (item.to === '/admin/dashboard' && location.pathname === '/admin'); return <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} title={collapsed ? item.label : undefined} className={cn('mb-1 flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold', active ? 'bg-brand-emerald text-white' : 'text-white/70 hover:bg-white/10 hover:text-white')}><Icon className="h-5 w-5 shrink-0" />{!collapsed && item.label}</Link>; })}</div>)}</nav><div className="border-t border-white/10 p-3"><button className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-white/10" onClick={() => setUserOpen((value) => !value)}><UserInitials email={administrateur?.email} />{!collapsed && <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{administrateur?.email ?? 'Administrateur'}</span><span className="block text-xs text-white/60">Administrateur</span></span>}<ChevronDown className="h-4 w-4" /></button>{userOpen && <button onClick={() => { void logout(); }} className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"><LogOut className="h-4 w-4" />Déconnexion</button>}</div></aside>;
  const currentItem = navItems.find((item) => location.pathname === item.to);
  return <div className="min-h-screen bg-brand-sand/60"><div className="fixed inset-y-0 left-0 z-30 hidden lg:block">{sidebar}</div><Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}><div className="h-full -m-6">{sidebar}</div></Drawer><div className={cn('min-h-screen transition-all lg:ml-72', collapsed && 'lg:ml-20')}><header className="sticky top-0 z-20 flex min-h-20 items-center gap-4 border-b border-brand-deep/10 bg-white/95 px-4 backdrop-blur sm:px-7"><IconButton className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Ouvrir le menu"><Menu /></IconButton><div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-[.14em] text-brand-muted">Administration</p><div className="mt-1 flex items-center gap-2 text-sm text-brand-muted"><span>AFD</span><ChevronRight className="h-3 w-3" /><span className="truncate font-semibold text-brand-ink">{currentItem?.label ?? 'Espace de gestion'}</span></div></div><IconButton aria-label="Notifications" className="relative"><Bell className="h-5 w-5" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-gold" aria-hidden="true" /></IconButton><button className="hidden items-center gap-2 rounded-xl p-2 hover:bg-brand-sand sm:flex" onClick={() => setUserOpen((value) => !value)}><UserInitials email={administrateur?.email} /><span className="max-w-36 truncate text-left text-sm font-semibold">{administrateur?.email}</span></button></header><main className="p-4 sm:p-7">{children}</main></div></div>;
}
