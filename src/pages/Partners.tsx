import { useCallback, useMemo, useState } from 'react';
import { EmptyState, PageHero, PartnerCard } from '../components/common';
import { Container, ErrorState, LoadingState, Section, Select } from '../components/ui';
import { useContentResource } from '../hooks/useContentResource';
import { usePageMeta } from '../hooks/usePageMeta';
import { partenaireService } from '../services/contentService';

export default function Partners() {
  const loader = useCallback(() => partenaireService.list(), []);
  const { data: partners, loading, error, reload } = useContentResource(loader, []);
  const [category, setCategory] = useState('tous');
  const categories = useMemo(() => ['tous', ...new Set(partners.map((partner) => partner.category))], [partners]);
  const visiblePartners = partners.filter((partner) => category === 'tous' || partner.category === category);
  usePageMeta({ title: 'Nos partenaires', description: 'Découvrez les partenaires qui contribuent aux actions de l’AFD.' });
  return <div><PageHero eyebrow="Partenaires" title="Des alliances engagées pour un impact durable." description="L’AFD travaille avec des institutions, des organisations et des acteurs locaux qui partagent son ambition pour les femmes et les communautés." /><Section><Container><div className="max-w-xs"><Select label="Filtrer par catégorie" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item} value={item}>{item === 'tous' ? 'Toutes les catégories' : item}</option>)}</Select></div>{loading ? <div className="mt-10"><LoadingState /></div> : error && !partners.length ? <div className="mt-10"><ErrorState description="Les partenaires sont indisponibles." onRetry={() => { void reload(); }} /></div> : visiblePartners.length ? <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{visiblePartners.map((partner) => <PartnerCard key={partner.id} partner={partner} />)}</div> : <div className="mt-10"><EmptyState title="Aucun partenaire dans cette catégorie" /></div>}</Container></Section></div>;
}
