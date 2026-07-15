import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ContactCTA, PageHero, PartnerCard } from '../components/common';
import { Card, Container, ErrorState, LoadingState, Section, SectionHeader } from '../components/ui';
import { useContentResource } from '../hooks/useContentResource';
import { usePageMeta } from '../hooks/usePageMeta';
import { loadSettings, partenaireService } from '../services/contentService';
import { interventionAreas, impactStory } from '../services/homeContent';

export default function Impact() {
  const settingsLoader = useCallback(() => loadSettings(), []);
  const partnersLoader = useCallback(() => partenaireService.list(), []);
  const { data: settings, loading: settingsLoading } = useContentResource(settingsLoader, {});
  const { data: partners, error, reload } = useContentResource(partnersLoader, []);
  usePageMeta({ title: 'Notre impact', description: 'Découvrez les résultats, les territoires et les partenariats qui portent l’impact de l’AFD.' });
  const stats = [{ label: 'Personnes accompagnées', value: settings.beneficiaries ? `${Number(settings.beneficiaries).toLocaleString('fr-FR')}+` : '—' }, { label: 'Projets actifs', value: settings.active_projects ?? '—' }, { label: 'Provinces couvertes', value: settings.provinces_count ?? '—' }];
  return <div><PageHero eyebrow="Notre impact" title="Rendre compte de l’action, apprendre du terrain." description="L’AFD partage des résultats utiles, sans les dissocier des réalités et des voix qui les rendent possibles." /><Section><Container>{settingsLoading ? <LoadingState /> : <div className="grid gap-5 sm:grid-cols-3">{stats.map((stat) => <Card key={stat.label} className="border-l-4 border-l-brand-gold p-6"><p className="text-3xl font-bold text-brand-deep">{stat.value}</p><p className="mt-2 text-sm font-bold text-brand-muted">{stat.label}</p></Card>)}</div>}</Container></Section><section className="bg-brand-sand"><Container className="grid gap-8 py-14 lg:grid-cols-2"><div><SectionHeader eyebrow="Territoires" title="Des résultats qui s’inscrivent dans les provinces." description="Les informations détaillées par zone seront publiées au fur et à mesure de la consolidation des données de suivi." /></div><div className="grid gap-3 sm:grid-cols-2">{interventionAreas.map((area) => <Card key={area.name} className="p-5"><p className="font-bold">{area.name}</p><p className="mt-1 text-sm text-brand-muted">{area.province}</p></Card>)}</div></Container></section><Section><Container><SectionHeader eyebrow="Histoire d’impact" title="L’impact commence par l’écoute." /><Card className="mt-8 max-w-3xl p-8"><p className="text-xl font-bold leading-8 text-brand-deep">« {impactStory.quote} »</p><p className="mt-5 text-sm text-brand-muted">{impactStory.attribution}</p></Card></Container></Section><Section className="bg-brand-deep text-white"><Container><SectionHeader inverse eyebrow="Partenariats" title="Des collaborations qui renforcent l’action." description="Les partenaires soutiennent les programmes, les communautés et le partage des apprentissages." />{error && !partners.length ? <div className="mt-8"><ErrorState description="Les partenaires sont indisponibles." onRetry={() => { void reload(); }} /></div> : <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{partners.slice(0, 4).map((partner) => <PartnerCard key={partner.id} partner={partner} />)}</div>}<Link to="/partenaires" className="mt-8 inline-block text-sm font-bold text-brand-gold">Voir tous les partenaires</Link></Container></Section><ContactCTA /></div>;
}
