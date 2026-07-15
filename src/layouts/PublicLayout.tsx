import { useEffect, useState, type ReactNode } from 'react';
import { ArrowUp, ChevronDown, Heart, Menu, X } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import logo from '../assets/adf-logo.jpg';
import { Button, Container, Drawer, IconButton, cn } from '../components/ui';

type NavigationItem = { label: string; to: string; children?: Array<{ label: string; to: string }> };

const navigation: NavigationItem[] = [
  { label: 'Accueil', to: '/' },
  { label: 'L’Organisation', to: '/organisation' },
  { label: 'Nos Programmes', to: '/programmes', children: [{ label: 'Programmes', to: '/programmes' }, { label: 'Clusters & groupes de travail', to: '/clusters' }] },
  { label: 'Nos Projets', to: '/projets' },
  { label: 'Notre Impact', to: '/impact' },
  { label: 'Actualités', to: '/actualites' },
  { label: 'Médiathèque', to: '/mediatheque' },
  { label: 'Contact', to: '/contact' },
];

function Brand({ light = false }: { light?: boolean }) {
  return <Link to="/" className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"><img src={logo} alt="Alliance des Femmes pour le Développement" className="h-11 w-11 rounded-full object-cover sm:h-12 sm:w-12" /><span className="min-w-0"><strong className={cn('block text-base leading-none', light ? 'text-white' : 'text-brand-deep')}>AFD</strong><span className={cn('mt-1 hidden max-w-44 text-[10px] font-semibold uppercase tracking-[0.08em] sm:block', light ? 'text-white/70' : 'text-brand-muted')}>Alliance des Femmes pour le Développement</span></span></Link>;
}

function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) => cn('rounded-lg px-2 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold', isActive ? 'text-brand-deep' : 'text-brand-muted hover:text-brand-deep');
  return <header className="sticky top-0 z-50">
    <div className="bg-brand-aubergine text-white"><Container className="flex min-h-9 items-center justify-center text-center text-xs font-medium">Ensemble, soutenons le leadership des femmes et le développement communautaire en RDC.</Container></div>
    <div className={cn('border-b border-brand-deep/10 bg-white/95 backdrop-blur transition-all', scrolled ? 'shadow-sm' : '')}>
      <Container className={cn('flex items-center justify-between gap-4 transition-all', scrolled ? 'min-h-16' : 'min-h-20')}>
        <Brand />
        <nav aria-label="Navigation principale" className="hidden items-center gap-0.5 xl:flex">
          {navigation.map((item) => <div key={item.label} className="relative" onMouseEnter={() => setActiveMenu(item.label)} onMouseLeave={() => setActiveMenu(null)}>
            <NavLink to={item.to} className={navLinkClass}>{item.label}{item.children && <ChevronDown className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />}</NavLink>
            {item.children && activeMenu === item.label && <div className="absolute left-0 top-full pt-2"><div className="w-64 rounded-xl border border-brand-deep/10 bg-white p-2 shadow-xl">{item.children.map((child) => <Link key={child.to} to={child.to} className="block rounded-lg px-3 py-2 text-sm font-medium text-brand-muted hover:bg-brand-sand hover:text-brand-deep">{child.label}</Link>)}</div></div>}
          </div>)}
        </nav>
        <div className="hidden items-center gap-2 xl:flex"><Link to="/adhesion"><Button variant="outline">Nous rejoindre</Button></Link><Link to="/don"><Button><Heart className="h-4 w-4" aria-hidden="true" />Faire un don</Button></Link></div>
        <IconButton className="xl:hidden" onClick={() => setOpen(true)} aria-label="Ouvrir le menu"><Menu aria-hidden="true" /></IconButton>
      </Container>
    </div>
    <Drawer open={open} onClose={() => setOpen(false)}><div className="flex items-center justify-between"><Brand /><IconButton onClick={() => setOpen(false)} aria-label="Fermer le menu"><X /></IconButton></div><nav aria-label="Navigation mobile" className="mt-8 space-y-1">{navigation.map((item) => <div key={item.label}><NavLink to={item.to} className={navLinkClass}>{item.label}</NavLink>{item.children?.map((child) => <Link key={child.to} to={child.to} className="block px-5 py-2 text-sm text-brand-muted">{child.label}</Link>)}</div>)}</nav><div className="mt-8 grid gap-3"><Link to="/membership"><Button className="w-full" variant="outline">Nous rejoindre</Button></Link><Link to="/donate"><Button className="w-full">Faire un don</Button></Link></div></Drawer>
  </header>;
}

function PublicFooter() {
  return <footer className="bg-brand-ink pb-8 pt-14 text-white"><Container><div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4"><div><Brand light /><p className="mt-5 max-w-xs text-sm leading-6 text-white/70">L’AFD porte des initiatives de développement inclusif, de protection et de leadership féminin en République démocratique du Congo.</p></div><div><h2 className="font-bold">Explorer</h2><ul className="mt-4 space-y-3 text-sm text-white/70"><li><Link to="/organisation">L’Organisation</Link></li><li><Link to="/programmes">Nos Programmes</Link></li><li><Link to="/projets">Nos Projets</Link></li><li><Link to="/actualites">Actualités</Link></li></ul></div><div><h2 className="font-bold">S’engager</h2><ul className="mt-4 space-y-3 text-sm text-white/70"><li><Link to="/adhesion">Nous rejoindre</Link></li><li><Link to="/don">Faire un don</Link></li><li><Link to="/contact">Collaborer avec nous</Link></li></ul></div><div><h2 className="font-bold">Nous contacter</h2><address className="mt-4 space-y-3 text-sm not-italic leading-6 text-white/70">Kinshasa, République démocratique du Congo<br /><a href="mailto:contact@afd-rdc.org" className="hover:text-white">contact@afd-rdc.org</a><br /><Link to="/contact" className="font-semibold text-brand-gold hover:text-white">Écrire à l’équipe</Link></address></div></div><div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/15 pt-6 text-xs text-white/60 sm:flex-row"><p>© {new Date().getFullYear()} Alliance des Femmes pour le Développement.</p><p>Engagement · Transparence · Leadership</p></div></Container></footer>;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const handler = () => setVisible(window.scrollY > 500); window.addEventListener('scroll', handler, { passive: true }); return () => window.removeEventListener('scroll', handler); }, []);
  if (!visible) return null;
  return <IconButton className="fixed bottom-5 right-5 z-40 bg-brand-deep text-white shadow-lg hover:bg-brand-emerald" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Retour en haut"><ArrowUp /></IconButton>;
}

export default function PublicLayout({ children }: { children?: ReactNode }) {
  return <div className="min-h-screen bg-white text-brand-ink"><PublicHeader /><main>{children ?? <Outlet />}</main><PublicFooter /><BackToTop /></div>;
}
