// =============================================================
// NotFound.tsx — Page 404 de l'AFD
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600)
// =============================================================

import { Compass, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Container, Section } from '../components/ui';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta({ title: 'Page introuvable', description: 'La page demandée est introuvable.' });
  return (
    <Section className="min-h-[65vh] bg-brand-sand"><Container className="flex min-h-[52vh] items-center justify-center"><div className="max-w-xl text-center"><Compass className="mx-auto h-14 w-14 text-brand-emerald" aria-hidden="true" /><p className="mt-5 text-7xl font-bold text-brand-deep">404</p><h1 className="mt-4 text-3xl font-bold">Cette page est introuvable.</h1><p className="mt-4 leading-7 text-brand-muted">Elle a peut-être été déplacée ou l’adresse est incomplète. Revenez vers les contenus essentiels de l’AFD.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/"><Button><Home className="h-4 w-4" />Accueil</Button></Link><Link to="/programmes"><Button variant="outline">Nos programmes</Button></Link></div></div></Container></Section>
  );
}
